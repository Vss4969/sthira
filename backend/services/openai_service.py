"""
File implements OpenAI service.
"""
from time import sleep
import requests
import tiktoken
from config.constants import OPEN_AI_KEY


class OpenAIService:

    """
    Class implements functions to interact with OpenAI API.
    """

    def __init__(self):
        self.api_endpoint = 'https://api.openai.com/v1/chat/completions'

    def crop_prompt(self, prompt: str) -> str:
        """
        Crop a prompt to 4000 tokens to avoid OpenAI API limit.

        Args:
            prompt (str): Prompt to be cropped.
s
        Returns:
            new_prompt (str): Cropped prompt.
        """
        encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
        encoded_prompt = encoding.encode(prompt)
        new_prompt = encoded_prompt[:4000]
        return encoding.decode(new_prompt)

    def chat(self, prompt: str) -> str:
        """
        Get a response to a custom prompt from OpenAI API.

        Args:
            prompt (str): Prompt to be sent to OpenAI API.

        Returns:
            response (str): Response from OpenAI API.
        """
        new_prompt = self.crop_prompt(prompt)
        data = {
            'model': 'gpt-3.5-turbo',
            'messages': [
                {'role': 'system', 'content': 'You are a helpful assistant.'},
                {'role': 'user', 'content': new_prompt}
            ]
        }

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {OPEN_AI_KEY}'
        }

        try:
            while True:
                response = requests.post(
                    self.api_endpoint, json=data, headers=headers, timeout=100)
                if response.status_code == 429:
                    print(
                        "OpenAI API rate limit exceeded. Waiting 10 seconds..: ", response.json())
                    print()
                    sleep(10)
                    continue
                if 'choices' not in response.json():
                    return ""
                return response.json()['choices'][0]['message']['content']
        except Exception as e:  # pylint: disable=broad-except
            print("Exception while getting OpenAI response: ", e)
            return ""
