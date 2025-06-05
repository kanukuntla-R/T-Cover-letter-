import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def match_qualifications_with_llm(cover_letter_text, qualifications):
    prompt = f"""
You are an AI assistant helping a recruiter.

Here is the cover letter:

\"\"\"{cover_letter_text}\"\"\"

And here is a list of job requirements:

{qualifications}

For each requirement, find the most relevant sentence or phrase from the cover letter.
Return your response as a JSON object like this:
{{
  "Requirement1": "Matched sentence or phrase...",
  ...
}}
Only return valid JSON.
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",  # or "gpt-4"
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
    )

    return response.choices[0].message.content
