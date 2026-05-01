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
            if (res.ok && res.body) {
                // Pipe the stream directly back to the client
                return new Response(res.body, {
                    headers: { "Content-Type": "text/plain; charset=utf-8" }
                });
            } else {
                console.warn("Python AI Backend failed or returned no body, falling back to local...");
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
    } else if (action === "chat") {
        prompt = `You are SOUL, the AI assistant for the SOULPAD platform, a brutalist, high-impact dark fiction community. 
Your tone should be helpful but maintain the raw, slightly edgy, and highly atmospheric style of the platform.
The user is asking a question or chatting. Keep responses concise and engaging.
User's message:
"${text}"`;
    } else if (action === "forge") {
        prompt = `You are SOUL, the worldbuilding architect of a brutalist dark fiction platform. 
The author needs you to generate structured lore, a character sheet, or worldbuilding details based on their input.
Format your response nicely in markdown. Do not include conversational filler, just the requested lore.
Input:
"${text}"`;
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
                const response = await ai.models.generateContent({ model: "gemini-1.5-pro-latest", contents: prompt });
                aiResponseText = response.text || "";
            } catch (e2: any) {
                console.warn("All Gemini models failed:", e2.message);
            }
        }
    }

    // 2. OpenRouter Dynamic Model Routing
    if (!aiResponseText && process.env.OPENROUTER_API_KEY) {
        let targetModel = "openrouter/free"; // Auto-routes to any available free model to prevent rate limits

        // Route based on action to the most specialized model (using the main key)
        if (action === "continue") {
            targetModel = "venice/uncensored:free"; // Uncensored creativity for dark fiction
        } else if (action === "polish" || action === "originality") {
            targetModel = "nousresearch/hermes-3-llama-3.1-405b:free"; // Elite editing/logic
        }

        console.warn(`Routing to OpenRouter Model: ${targetModel}...`);
        let useFallback = false;

        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://stoery.app",
                    "X-Title": "SOULPAD Neural Engine",
                },
                body: JSON.stringify({
                    model: targetModel,
                    messages: [{ role: "user", content: prompt }],
                    temperature: action === "continue" ? 0.9 : 0.7,
                    max_tokens: 1500
                })
            });
            
            if (res.ok) {
                const data = await res.json();
                aiResponseText = data.choices?.[0]?.message?.content || "";
            } else {
                const errData = await res.json();
                console.warn(`OpenRouter API Error (${targetModel}):`, errData);
                useFallback = true;
            }
        } catch (e: any) {
            console.warn(`OpenRouter routing failed (${targetModel}):`, e.message);
            useFallback = true;
        }

        // FAILSAFE: If the specialized model is overloaded, instantly fall back to auto-router
        if (useFallback && targetModel !== "openrouter/free") {
            console.warn("Specialized model failed/rate-limited. Engaging Failsafe: Routing to openrouter/free...");
            try {
                const resFallback = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://stoery.app",
                    },
                    body: JSON.stringify({
                        model: "openrouter/free",
                        messages: [{ role: "user", content: prompt }],
                        temperature: 0.7,
                        max_tokens: 1500
                    })
                });
                if (resFallback.ok) {
                    const dataFallback = await resFallback.json();
                    aiResponseText = dataFallback.choices?.[0]?.message?.content || "";
                }
            } catch (fallbackError: any) {
                console.warn("Gemma 2 Failsafe also failed:", fallbackError.message);
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
        throw new Error(`OpenRouter/Gemini failed to generate a response. Please check your Next.js terminal for the exact API error.`);
    }

    return NextResponse.json({ text: aiResponseText });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
