import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { action, text, context } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
            { error: "GEMINI_API_KEY is missing from your .env file. Please add it to use the AI features." },
            { status: 500 }
        );
    }

    const ai = new GoogleGenAI({});

    let prompt = "";

    if (action === "continue") {
        prompt = `You are a dark fantasy / sci-fi author writing in a brutalist, raw, and highly atmospheric style. 
Continue the following story snippet seamlessly. Provide exactly one or two new paragraphs. Do not add conversational filler.
Here is the existing context of the story for reference: "${context || 'None'}"
Continue from here:
"${text}"`;
    } else if (action === "polish") {
        prompt = `You are an elite editor for a brutalist fiction platform. 
Take the following text and fix any grammatical errors, tighten the prose, and enhance the atmosphere to be slightly more gripping and raw, without changing the core meaning or plot.
Do not add any conversational filler. Just return the polished text.
Text to polish:
"${text}"`;
    } else {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    let response;
    try {
        response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
    } catch (primaryError: any) {
        console.warn("Primary model failed, falling back to gemini-1.5-flash:", primaryError.message);
        try {
            response = await ai.models.generateContent({
                model: "gemini-1.5-flash",
                contents: prompt,
            });
        } catch (fallbackError: any) {
            throw new Error("The AI is currently experiencing high demand. Please wait a few moments and try again.");
        }
    }

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
