import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try fallback to hardcoded key from recent context if needed, but rely on .env first
    pass 

genai.configure(api_key=api_key)

try:
    print("Checking for Gemini 3 models:")
    found = False
    for m in genai.list_models():
        if 'gemini-3' in m.name:
            print(f"- {m.name}")
            found = True
    if not found:
        print("No Gemini 3 models found in list.")
        # Print all just in case I am wrong about name
        # print([m.name for m in genai.list_models()])
except Exception as e:
    print(f"Error: {e}")
