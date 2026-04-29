import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { action, text, context } = await req.json();

    if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY) {
        return NextResponse.json(
            { error: "No AI API keys found. Please add GEMINI_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY to your .env file." },
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

    let aiResponseText = "";

    // 1. Try Gemini Models (if key exists)
    if (process.env.GEMINI_API_KEY && !aiResponseText) {
        const ai = new GoogleGenAI({});
        try {
            const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
            aiResponseText = response.text || "";
        } catch (e1: any) {
            console.warn("Gemini 2.5 failed, trying 1.5...");
            try {
                const response = await ai.models.generateContent({ model: "gemini-1.5-flash", contents: prompt });
                aiResponseText = response.text || "";
            } catch (e2: any) {
                console.warn("All Gemini models failed:", e2.message);
            }
        }
    }

    // 2. Try Groq (Llama 3) as fallback
    if (process.env.GROQ_API_KEY && !aiResponseText) {
        console.warn("Falling back to Groq API...");
        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                })
            });
            if (res.ok) {
                const data = await res.json();
                aiResponseText = data.choices[0]?.message?.content || "";
            }
        } catch (e: any) {
            console.warn("Groq fallback failed:", e.message);
        }
    }

    // 3. Try OpenAI (GPT-4o-mini) as tertiary fallback
    if (process.env.OPENAI_API_KEY && !aiResponseText) {
        console.warn("Falling back to OpenAI API...");
        try {
            const res = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7
                })
            });
            if (res.ok) {
                const data = await res.json();
                aiResponseText = data.choices[0]?.message?.content || "";
            }
        } catch (e: any) {
            console.warn("OpenAI fallback failed:", e.message);
        }
    }

    if (!aiResponseText) {
        throw new Error("All AI providers are currently experiencing high demand. Please wait a few moments and try again.");
    }

    return NextResponse.json({ text: aiResponseText });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
