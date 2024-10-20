import boto3
import json
import os
from botocore.exceptions import ClientError

# Set up the Amazon Bedrock client
bedrock_runtime = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-west-2',  # Replace with your AWS region
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY")
)

# Initialize conversation history
conversation_history = []

def save_conversation(history, filename="conversation_history.json"):
    with open(filename, 'w') as f:
        json.dump(history, f, indent=4)

# Define the message
message = "What's the difference between Amazon Aurora and RDS?"

# Prepare the request body
request_body = json.dumps({
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 300,
    "temperature": 0.7,
    "messages": [
        {"role": "user", "content": message}
    ]
})

# Specify the Claude 3.5 Sonnet model ID
model_id = 'anthropic.claude-3-5-sonnet-20240620-v1:0'

try:
    print(f"Invoking model: {model_id}")
    response = bedrock_runtime.invoke_model(
        modelId=model_id,
        body=request_body
    )

    # Parse and print the response
    response_body = json.loads(response['body'].read())
    model_response = response_body['content'][0]['text']
    print("Response:", model_response)
    
    # Append to conversation history
    conversation_history.append({"role": "user", "content": message})
    conversation_history.append({"role": "assistant", "content": model_response})

    # Save conversation history
    save_conversation(conversation_history)

except ClientError as e:
    error_code = e.response['Error']['Code']
    error_message = e.response['Error']['Message']
    print(f"Error: {error_code} - {error_message}")
except Exception as e:
    print(f"Unexpected error: {str(e)}")

# Print debugging information
print("\nDebugging Information:")
print(f"AWS Region: {bedrock_runtime.meta.region_name}")
print(f"Model used: {model_id}")
print("Please ensure you have the correct permissions and that this model is available in your region.")
