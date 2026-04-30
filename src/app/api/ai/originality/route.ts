import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/prisma";

async function callAI(prompt: string): Promise<string> {
    let aiResponseText = "";

    // 1. Try Gemini 2.0-flash
    if (process.env.GEMINI_API_KEY && !aiResponseText) {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        try {
            const response = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: prompt });
            aiResponseText = response.text || "";
        } catch (e1: any) {
            console.warn("Gemini 2.0-flash failed:", e1.message);
            // Fallback to gemini-1.5-pro
            try {
                const response = await ai.models.generateContent({ model: "gemini-2.0-flash-lite", contents: prompt });
                aiResponseText = response.text || "";
            } catch (e2: any) {
                console.warn("Gemini 2.0-flash-lite failed:", e2.message);
            }
        }
    }

    // 2. OpenRouter — paid model (gemini-2.5-flash) with max_tokens to stay within budget
    if (process.env.OPENROUTER_API_KEY && !aiResponseText) {
        console.warn("Falling back to OpenRouter paid model...");
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
                    max_tokens: 1500,
                    temperature: 0.3
                })
            });
            if (res.ok) {
                const data = await res.json();
                aiResponseText = data.choices?.[0]?.message?.content || "";
            } else {
                const err = await res.json();
                console.warn("OpenRouter paid model error:", err.error?.message);
            }
        } catch (e: any) {
            console.warn("OpenRouter paid model failed:", e.message);
        }
    }

    // 3. OpenRouter — free model fallback
    if (process.env.OPENROUTER_API_KEY && !aiResponseText) {
        console.warn("Falling back to OpenRouter free model...");
        try {
            const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "openrouter/free",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 1500,
                    temperature: 0.3
                })
            });
            if (res.ok) {
                const data = await res.json();
                aiResponseText = data.choices?.[0]?.message?.content || "";
            } else {
                const err = await res.json();
                console.warn("OpenRouter free model error:", err.error?.message);
            }
        } catch (e: any) {
            console.warn("OpenRouter free model failed:", e.message);
        }
    }

    // 4. Groq fallback
    if (process.env.GROQ_API_KEY && !aiResponseText) {
        console.warn("Falling back to Groq...");
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
                    max_tokens: 1500,
                    temperature: 0.3
                })
            });
            if (res.ok) {
                const data = await res.json();
                aiResponseText = data.choices?.[0]?.message?.content || "";
            }
        } catch (e: any) {
            console.warn("Groq fallback failed:", e.message);
        }
    }

    if (!aiResponseText) {
        throw new Error("All AI providers failed. Please wait a moment and try again.");
    }
    return aiResponseText;
}

export async function POST(req: Request) {
    try {
        if (!process.env.GEMINI_API_KEY && !process.env.OPENROUTER_API_KEY && !process.env.GROQ_API_KEY) {
            return NextResponse.json({ error: "No AI API keys configured." }, { status: 500 });
        }

        const { text, title, storyId } = await req.json();

        if (!text || text.trim().length < 100) {
            return NextResponse.json({ error: "Please write at least 100 characters before running an originality check." }, { status: 400 });
        }

        // If a dedicated Python backend is configured, proxy the request
        if (process.env.BACKEND_AI_URL) {
            try {
                const res = await fetch(`${process.env.BACKEND_AI_URL}/originality`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text, title, storyId })
                });
                if (res.ok) {
                    const data = await res.json();
                    // If the python backend returns a string, we might need to parse it if it wasn't parsed there
                    const report = typeof data.report === 'string' ? JSON.parse(data.report.replace(/```json|```/g, "").trim()) : data.report;
                    
                    // If storyId is provided, save to DB (consistent with local logic)
                    if (storyId) {
                        await prisma.story.update({
                            where: { id: storyId },
                            data: {
                                originalityScore: report.originalityScore,
                                originalityReport: report
                            }
                        });
                    }
                    return NextResponse.json({ report });
                } else {
                    console.warn("Python Originality Backend failed, falling back to local...");
                }
            } catch (e: any) {
                console.warn("Python Originality Backend connection error:", e.message);
            }
        }

        const prompt = `You are an expert literary plagiarism analyst and originality reviewer for a fiction publishing platform.


Analyze the following story excerpt and provide a structured originality report. Be thorough but fair.

Story Title: "${title || 'Untitled'}"
Story Excerpt:
---
${text.substring(0, 3000)}
---

Respond with a valid JSON object in EXACTLY this structure (no markdown code fences, no explanation outside the JSON):
{
  "originalityScore": <integer 0-100>,
  "verdict": "<one of: ORIGINAL | LIKELY_ORIGINAL | SUSPICIOUS | HIGH_RISK>",
  "summary": "<2-3 sentence overall assessment>",
  "flags": [
    {
      "type": "<one of: KNOWN_WORK | COMMON_TROPE | GENERIC_PROSE | STYLE_MATCH | SUSPICIOUS_PHRASE>",
      "description": "<specific observation>",
      "severity": "<one of: LOW | MEDIUM | HIGH>"
    }
  ],
  "strengths": ["<originality strength 1>", "<originality strength 2>"],
  "recommendation": "<one of: PUBLISH | REVIEW_FURTHER | DO_NOT_PUBLISH>"
}`;

        const rawText = await callAI(prompt);

        // Robustly extract JSON — strip markdown code fences if present
        const cleaned = rawText.replace(/```json|```/g, "").trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("AI raw output:", rawText);
            throw new Error("AI returned an unexpected format. Please try again.");
        }

        const report = JSON.parse(jsonMatch[0]);

        // If storyId is provided, save to DB
        if (storyId) {
            await prisma.story.update({
                where: { id: storyId },
                data: {
                    originalityScore: report.originalityScore,
                    originalityReport: report
                }
            });
        }

        return NextResponse.json({ report });
    } catch (error: any) {
        console.error("Originality Check Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
