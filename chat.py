import sys
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
major,year, coursestaken, career = "","","",""
with open('uploads/data.csv', 'r') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            major,year, career, coursestaken= row
            # print(row)
            # print(major, year, coursestaken, career)
required_courses = f"'According to what I entered in the website, I am a {major} major in {year}, I have taken the courses {coursestaken}, and I want to pursue a career in {career}. These are the courses required for a mechanical engineering major: {csv_string}'"


if os.path.exists('uploads\prompt.txt'):
    with open('uploads\prompt.txt', 'r') as file:
        prompt = file.read()
        if prompt == '':
            beginning = True
        else:
            beginning = False
else:
     beginning = True

if beginning:
    prompt = "Introduce Yourself"

    # Initialize conversation history
    conversation_history = ""
    conversation_history += ("{'role': 'user', 'content': 'Hi, what is your name?'},'role': 'assistant', 'content': 'Hi! My name is Chip, your AI academic counselor.'")
    conversation_history += "{'role': 'user', 'content':" + required_courses + "}" 
    with open("conversation.txt", 'w') as file:
        file.write(conversation_history)

done = False
counter = 1

while not done:
    
    if prompt.lower() in ["quit","exit","done"]:
        break

    with open("conversation.txt", 'r') as file:
        conversation_history = file.read()

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

        # print("Chip's response:", model_response)

        # Append to conversation history
        conversation_history += "{'role': 'user', 'content':" + prompt + "}"
        conversation_history += "{'role': 'assistant', 'content':" + model_response + "}"
        done = True
        response_json = {"role": "assistant", "content": model_response}
        print(json.dumps(response_json))
        sys.exit(0)
        


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
