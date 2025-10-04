def lambda_handler(event, context):
    return {"statusCode": 202, "headers":{"Content-Type":"application/json"}, "body": '{"status":"accepted"}'}
