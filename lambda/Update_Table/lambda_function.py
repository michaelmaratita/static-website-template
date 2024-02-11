import boto3


client = boto3.client('dynamodb')

def lambda_handler(event, context):

    return {
        'views' : updateTable()
    }


def getViewerCount():
    response = client.get_item(
        TableName = 'INPUT_TABLE_NAME',  # Change Table Name to your table
        Key={
            'Id': {
                'N': '0'
            }
        },
        AttributesToGet=[
            'value'
            ]
    )
    return response['Item']['value']['N']
    

def updateTable():
    viewer_count = int(getViewerCount()) + 1
    
    client.update_item(
        TableName = 'INPUT_TABLE_NAME',  # Change Table Name to your table
        Key={
            'Id': {
                'N': '0'
            }
        },
       AttributeUpdates = {
           'value': {
               'Value': {
                   'N': str(viewer_count)
               },
               'Action': 'PUT'
           }
       }
    )
    return getViewerCount()