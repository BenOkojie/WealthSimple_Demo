def lambda_handler(event, context):
    return {"statusCode": 200, "headers":{"Content-Type":"application/json"}, "body": '{"cash":0,"positions":{}}'}
