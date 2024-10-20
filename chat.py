import boto3
import json
import os
import csv
from botocore.exceptions import ClientError
import requests

# Set up the Amazon Bedrock client
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-west-2',  # Replace with your AWS region
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY")
)

# def Post(response):
#     url = "/Sendinfo"

#     try:
#         response = requests.post(url, json={})

#         # Check if the request was successful
#         if response.status_code == 200:
#             print("Response data:", response.json())  # Assuming the response is JSON formatted
#         else:
#             print(f"POST request failed with status code: {response.status_code}")
#             print("Error response:", response.text)

#     except Exception as e:
#         print("An error occurred:", str(e))


with open('requiredcourses.csv', 'r') as file:
        csv_reader = csv.reader(file)
        csv_data = [row for row in csv_reader]
        csv_string = "\n".join([",".join(row) for row in csv_data])
    
print(csv_string)
required_courses = "'According to what I entered in the website, I am a mechanical engineering major and these are the courses required " + csv_string + "'"



# Initialize conversation history
conversation_history = ""
conversation_history += ("{'role': 'user', 'content': 'Hi, what is your name?'},'role': 'assistant', 'content': 'Hi! My name is Chip, your AI academic counselor.'")
conversation_history += "{'role': 'user', 'content':" + required_courses + "}" 

done = False
counter = 1

while not done:
    prompt = input("You: ")
    
    if prompt.lower() in ["quit","exit","done"]:
        break

    conversation_history += prompt

    # Prepare the request body
    request_body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 300,
        "temperature": 0.7,
        "messages": [
            {"role": "user", "content": conversation_history}
        ]
    })

    # Specify the Claude 3.5 Sonnet model ID
    model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0'

    try:
        
        response = bedrock_runtime.invoke_model(
            modelId=model_id,
            body=request_body
        )

        # Parse and print the response
        response_body = json.loads(response['body'].read())
        model_response = response_body['content'][0]['text']

        file_path = "conversation_history.json"

        print("Chip's response:", model_response)

        # Append to conversation history
        conversation_history += "{'role': 'user', 'content':" + prompt + "}"
        conversation_history += "{'role': 'assistant', 'content':" + model_response + "}"


    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        print(f"Error: {error_code} - {error_message}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")

    # Print debugging information
    # print("\nDebugging Information:")
    # print(f"AWS Region: {bedrock_runtime.meta.region_name}")
    # print(f"Model used: {model_id}")
    # print("Please ensure you have the correct permissions and that this model is available in your region.")
