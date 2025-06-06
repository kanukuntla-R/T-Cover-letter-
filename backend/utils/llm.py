import openai
import os
import json
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


def match_qualifications_with_llm(cover_letter_text, qualifications):
    qualifications_json = json.dumps(qualifications, indent=2)

    prompt = (
        "You are an AI assistant helping a recruiter screen candidates.\n\n"
        "Below is a candidate's cover letter:\n\n"
        f"\"\"\"\n{cover_letter_text}\n\"\"\"\n\n"
        "Here is a list of job requirements:\n\n"
        f"{qualifications_json}\n\n"
        "For each requirement, find the most relevant sentence or phrase from the cover letter.\n"
        "- Use only actual phrases from the letter — do not invent content.\n"
        "- Match only full sentences or professional phrases.\n"
        "- Do NOT match using numbers, greetings, sign-offs, names, phone numbers, or emails.\n"
        "- If no relevant content exists, return \"-\".\n\n"
        "Return your response as a valid JSON object in this format:\n"
        "{\n"
        "  \"Requirement1\": \"Matched sentence or phrase...\",\n"
        "  \"Requirement2\": \"-\"\n"
        "}\n\n"
        "Important:\n"
        "- NEVER respond with a number, year, email, phone, name, or any closing statement like 'Sincerely'.\n"
        "- If no match is found, return a dash: \"-\""
    )

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )
        content = response.choices[0].message.content.strip()
        return json.loads(content)
    except json.JSONDecodeError as e:
        raise ValueError(f"GPT response was not valid JSON: {e}\nResponse:\n{content}")
    except Exception as e:
        raise RuntimeError(f"OpenAI call failed: {e}")
