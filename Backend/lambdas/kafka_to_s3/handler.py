import os, io, gzip, json, base64, uuid, datetime, logging
import boto3

log = logging.getLogger()
log.setLevel(logging.INFO)

S3 = boto3.client("s3")

BUCKET = os.environ["S3_ARCHIVE_BUCKET"]           # comes from Globals in your template
PREFIX = os.environ.get("S3_ARCHIVE_PREFIX", "trades/")  # e.g., "trades/"

def _dt_parts(ts_ms: int):
    dt = datetime.datetime.utcfromtimestamp(ts_ms / 1000.0)
    return dt.strftime("%Y"), dt.strftime("%m"), dt.strftime("%d"), dt.strftime("%H")

def lambda_handler(event, context):
    """
    MSK trigger event shape:
      event["records"] = {
        "topicName-0": [
           {"topic":"topicName","partition":0,"offset":123,
            "timestamp":<ms>,"timestampType":"CREATE_TIME",
            "key":"base64...", "value":"base64..."},
           ...
        ],
        "topicName-1": [ ... ]
      }
    """
    total = 0
    ndjson_buf = io.BytesIO()

    # We’ll try to infer a date/hour partition from each record.
    # If a record lacks ts in its JSON value, we’ll fall back to event timestamp.
    year = month = day = hour = None
    topic_for_key = None

    for tp, recs in (event.get("records") or {}).items():
        for r in recs:
            total += 1
            topic_for_key = topic_for_key or r.get("topic") or "unknown"
            # decode payload
            raw = base64.b64decode(r.get("value") or b"")
            try:
                obj = json.loads(raw.decode("utf-8"))
            except Exception:
                # store as opaque if not JSON (still archive!)
                obj = {"_raw": raw.decode("utf-8", errors="replace")}

            # choose ts for partitioning
            ts_ms = (
                (obj.get("ts") if isinstance(obj.get("ts"), int) else None)
                or r.get("timestamp")
                or int(datetime.datetime.utcnow().timestamp() * 1000)
            )
            y, m, d, h = _dt_parts(ts_ms)
            year, month, day, hour = year or y, month or m, day or d, hour or h

            # append one NDJSON line
            ndjson_buf.write(json.dumps(obj, separators=(",", ":"), ensure_ascii=False).encode("utf-8"))
            ndjson_buf.write(b"\n")

    if total == 0:
        log.info("No records in batch.")
        return

    # Build S3 key: trades/dt=YYYY-MM-DD/hour=HH/topic=<topic>/batch-<uuid>.ndjson.gz
    batch_id = str(uuid.uuid4())
    key = f"{PREFIX}dt={year}-{month}-{day}/hour={hour}/topic={topic_for_key}/batch-{batch_id}.ndjson.gz"

    # gzip and upload once per batch
    ndjson_buf.seek(0)
    gz_buf = io.BytesIO()
    with gzip.GzipFile(fileobj=gz_buf, mode="wb") as gz:
        gz.write(ndjson_buf.getvalue())

    gz_buf.seek(0)
    S3.put_object(Bucket=BUCKET, Key=key, Body=gz_buf.getvalue(), ContentType="application/x-ndjson", ContentEncoding="gzip")

    log.info("Archived %s records to s3://%s/%s", total, BUCKET, key)
