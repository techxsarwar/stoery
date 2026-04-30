import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { action, text, context } = await req.json();

    if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY && !process.env.GROQ_API_KEY && !process.env.OPENROUTER_API_KEY) {
        return NextResponse.json(
            { error: "No AI API keys found. Please add GEMINI_API_KEY, OPENROUTER_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY to your .env file." },
            { status: 500 }
        );
    }

    // If a dedicated Python backend is configured, proxy the request
    if (process.env.BACKEND_AI_URL) {
        try {
            const res = await fetch(`${process.env.BACKEND_AI_URL}/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, text, context })
            });
            if (res.ok) {
                const data = await res.json();
                return NextResponse.json({ text: data.text });
            } else {
                console.warn("Python AI Backend failed, falling back to local...");
            }
        } catch (e: any) {
            console.warn("Python AI Backend connection error:", e.message);
        }
    }

    const ai = new GoogleGenAI({});

    let prompt = "";
    // ... (rest of the prompt logic)


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
    } else if (action === "title") {
        prompt = `You are a creative director for a dark fiction platform specializing in brutalist, high-impact titles.
Based on the following story content and synopsis, suggest exactly 5 compelling, evocative story titles.
Each title should be on its own line, numbered 1-5.
Do NOT include explanations or any other text — only the 5 numbered titles.
Story content/synopsis:
"${text || context || 'A dark fantasy epic'}"`;
    } else if (action === "synopsis") {
        prompt = `You are a literary editor for a dark fiction platform.
Based on the following story content, write a compelling 2-3 sentence synopsis/blurb that would entice a reader.
It should be atmospheric, intriguing, and end on a hook. Do NOT include any preamble — only return the synopsis text itself.
Story content:
"${text || context || 'A dark epic story'}"`;
    } else {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    let aiResponseText = "";

    // 1. Try Gemini Models (if key exists)
    if (process.env.GEMINI_API_KEY && !aiResponseText) {
        const ai = new GoogleGenAI({});
        try {
            const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });
            aiResponseText = response.text || "";
        } catch (e1: any) {
            console.warn("Gemini 2.0 failed, trying 1.5 pro...");
            try {
                const response = await ai.models.generateContent({ model: "gemini-1.5-pro", contents: prompt });
                aiResponseText = response.text || "";
            } catch (e2: any) {
                console.warn("All Gemini models failed:", e2.message);
            }
        }
    }

    // 2. Try OpenRouter as primary fallback
    if (process.env.OPENROUTER_API_KEY && !aiResponseText) {
        console.warn("Falling back to OpenRouter API...");
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://stoery.app",
                    "X-Title": "Stoery",
                },
                body: JSON.stringify({
                    model: "google/gemini-2.5-flash",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.7,
                    max_tokens: 1000
                })
            });
            if (res.ok) {
                const data = await res.json();
                aiResponseText = data.choices?.[0]?.message?.content || "";
                if (!aiResponseText || aiResponseText === "null") {
                    console.warn("OpenRouter returned null content, trying free model fallback");
                    aiResponseText = ""; // Reset to trigger next fallback
                }
            } else {
                const errData = await res.json();
                console.warn("OpenRouter API Error:", errData);
            }
        } catch (e: any) {
            console.warn("OpenRouter fallback failed:", e.message);
        }

        // Try free model if paid model failed or returned null (e.g. out of credits)
        if (!aiResponseText) {
            try {
                const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "meta-llama/llama-3-8b-instruct:free",
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.7,
                        max_tokens: 1000
                    })
                });
                if (res.ok) {
                    const data = await res.json();
                    aiResponseText = data.choices?.[0]?.message?.content || "";
                } else {
                    const errData = await res.json();
                    console.warn("OpenRouter Free Model API Error:", errData);
                }
            } catch (e: any) {
                console.warn("OpenRouter free fallback failed:", e.message);
            }
        }
    }

    // 3. Try Groq (Llama 3) as fallback
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
