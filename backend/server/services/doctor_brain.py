import os
from groq import Groq

# Default configuration settings
DEFAULT_QUERY = "Is there something wrong with my face?"
DEFAULT_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"

def analyze_image_with_query(system_prompt: str, user_query: str, model: str, encoded_image: str = None) -> str:
    """
    Interfaces with the Groq API to analyze patient text inquiries and base64-encoded clinical images.
    Uses structured message roles (system and user) for optimal LLM instruction compliance.
    """
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
    
    # Select request structure based on visual model requirements and input availability
    if not encoded_image or model == "meta-llama/llama-prompt-guard-2-86m":
        messages = [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_query
            }
        ]
    else:
        messages = [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text", 
                        "text": user_query
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{encoded_image}",
                        },
                    },
                ],
            }
        ]
        
    chat_completion = client.chat.completions.create(
        messages=messages,
        model=model
    )

    return chat_completion.choices[0].message.content
