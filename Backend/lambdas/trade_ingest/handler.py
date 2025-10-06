import os, json, uuid, time, logging
from typing import Optional
from confluent_kafka import Producer
from aws_msk_iam_sasl_signer.MSKAuthTokenProvider import generate_auth_token  # <-- correct import

log = logging.getLogger()
log.setLevel(logging.INFO)

AWS_REGION = os.environ["AWS_REGION"]
BOOTSTRAP   = os.environ["MSK_BOOTSTRAP_IAM"]   # e.g. "b-1...:9098,b-2...:9098"
TOPIC       = os.environ["TRADES_TOPIC"]

_producer: Optional[Producer] = None

def _oauth_refresh(oauth_cfg):
    """
    Called by librdkafka when it needs a fresh OAUTHBEARER token.
    aws_msk_iam_sasl_signer.generate_auth_token(region=...) returns a dict:
      {"token": "<jwt>", "expiry": <epoch_seconds>}
    """
    tok = generate_auth_token(region=AWS_REGION)
    token = tok["token"]
    expiry = int(tok["expiry"])
    # confluent-kafka >=2.x
    if hasattr(oauth_cfg, "set_token"):
        # set_token(token: str, lifetime: int, principal: str = "", extensions: list[tuple[str,str]] = [])
        oauth_cfg.set_token(token, expiry, "principalName=msk", [])
    else:
        # older binding name
        oauth_cfg.set_oauthbearer_token(token, expiry, "principalName=msk")

def _get_producer() -> Producer:
    global _producer
    if _producer:
        return _producer

    conf = {
        "bootstrap.servers": BOOTSTRAP,
        "security.protocol": "SASL_SSL",
        "sasl.mechanism": "OAUTHBEARER",
        "oauth_cb": _oauth_refresh,   # <- give Kafka a way to get IAM token
        "linger.ms": 10,
        "compression.type": "lz4",
    }
    _producer = Producer(conf)
    return _producer

def _res(code, body):
    return {"statusCode": code, "headers":{"Content-Type":"application/json"}, "body": json.dumps(body)}

VALID = {"DEPOSIT","WITHDRAW","BUY","SELL"}

def lambda_handler(event, context):
    headers = {(k or "").lower(): v for k, v in (event.get("headers") or {}).items()}
    account = headers.get("x-account-token")
    if not account:
        return _res(401, {"error": "Missing X-Account-Token"})

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return _res(400, {"error":"Invalid JSON"})

    if body.get("type") not in VALID:
        return _res(400, {"error": f"type must be one of {sorted(VALID)}"})

    payload = {
        **body,
        "eventId": body.get("eventId") or str(uuid.uuid4()),
        "accountId": account,
        "ts": body.get("ts") or int(time.time()*1000),
    }

    p = _get_producer()
    try:
        p.produce(TOPIC, key=account.encode(), value=json.dumps(payload).encode())
        p.flush(2.0)
    except Exception as e:
        log.exception("Kafka produce failed")
        return _res(503, {"error":"kafka_unavailable","detail":str(e)})

    return _res(202, {
    "status": "accepted",
    "eventId": payload["eventId"],
    "publishedTo": TOPIC,
    "samplePayload": payload
})