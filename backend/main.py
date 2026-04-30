import os
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Stoery AI Engine")

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class AIRequest(BaseModel):
    action: str
    text: str
    context: Optional[str] = None
    title: Optional[str] = None
    storyId: Optional[str] = None

class Flag(BaseModel):
    type: str
    description: str
    severity: str

class OriginalityReport(BaseModel):
    originalityScore: int
    verdict: str
    summary: str
    flags: List[Flag]
    strengths: List[str]
    recommendation: str

@app.get("/")
async def root():
    return {"status": "Stoery AI Engine is running", "version": "1.0.0"}

@app.post("/generate")
async def generate_content(req: AIRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    prompt = ""
    if req.action == "continue":
        prompt = f"""You are a dark fantasy / sci-fi author writing in a brutalist, raw, and highly atmospheric style. 
Continue the following story snippet seamlessly. Provide exactly one or two new paragraphs. Do not add conversational filler.
Here is the existing context of the story for reference: "{req.context or 'None'}"
Continue from here:
"{req.text}" """
    elif req.action == "polish":
        prompt = f"""You are an elite editor for a brutalist fiction platform. 
Take the following text and fix any grammatical errors, tighten the prose, and enhance the atmosphere to be slightly more gripping and raw, without changing the core meaning or plot.
Do not add any conversational filler. Just return the polished text.
Text to polish:
"{req.text}" """
    elif req.action == "title":
        prompt = f"""You are a creative director for a dark fiction platform specializing in brutalist, high-impact titles.
Based on the following story content and synopsis, suggest exactly 5 compelling, evocative story titles.
Each title should be on its own line, numbered 1-5.
Do NOT include explanations or any other text — only the 5 numbered titles.
Story content/synopsis:
"{req.text or req.context or 'A dark fantasy epic'}" """
    elif req.action == "synopsis":
        prompt = f"""You are a literary editor for a dark fiction platform.
Based on the following story content, write a compelling 2-3 sentence synopsis/blurb that would entice a reader.
It should be atmospheric, intriguing, and end on a hook. Do NOT include any preamble — only return the synopsis text itself.
Story content:
"{req.text or req.context or 'A dark epic story'}" """
    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        return {"text": response.text}
    except Exception as e:
        # Fallback to 1.5 pro if 2.0 fails
        try:
            model = genai.GenerativeModel("gemini-1.5-pro")
            response = model.generate_content(prompt)
            return {"text": response.text}
        except Exception as e2:
            raise HTTPException(status_code=500, detail=str(e2))

@app.post("/originality")
async def check_originality(req: AIRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    if not req.text or len(req.text.strip()) < 100:
        raise HTTPException(status_code=400, detail="Text too short for analysis")

    prompt = f"""You are an expert literary plagiarism analyst and originality reviewer for a fiction publishing platform.

Analyze the following story excerpt and provide a structured originality report. Be thorough but fair.

Story Title: "{req.title or 'Untitled'}"
Story Excerpt:
---
{req.text[:3000]}
---

Respond with a valid JSON object in EXACTLY this structure (no markdown code fences, no explanation outside the JSON):
{{
  "originalityScore": <integer 0-100>,
  "verdict": "ORIGINAL | LIKELY_ORIGINAL | SUSPICIOUS | HIGH_RISK",
  "summary": "<2-3 sentence overall assessment>",
  "flags": [
    {{
      "type": "KNOWN_WORK | COMMON_TROPE | GENERIC_PROSE | STYLE_MATCH | SUSPICIOUS_PHRASE",
      "description": "<specific observation>",
      "severity": "LOW | MEDIUM | HIGH"
    }}
  ],
  "strengths": ["<originality strength 1>", "<originality strength 2>"],
  "recommendation": "PUBLISH | REVIEW_FURTHER | DO_NOT_PUBLISH"
}}"""

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        # In a real scenario, we'd use response.text and parse JSON
        # For simplicity in this initial setup, we return the raw text or parse it
        return {"report": response.text} 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
