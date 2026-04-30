import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { text, storyId } = await req.json();

    if (!process.env.OPENROUTER_EMBED_API_KEY) {
        return NextResponse.json(
            { error: "OPENROUTER_EMBED_API_KEY not configured in .env" },
            { status: 500 }
        );
    }

    if (!text) {
        return NextResponse.json({ error: "Text is required to generate embeddings." }, { status: 400 });
    }

    const res = await fetch("https://openrouter.ai/api/v1/embeddings", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_EMBED_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://stoery.app",
            "X-Title": "SOULPAD Resonance Matrix",
        },
        body: JSON.stringify({
            model: "nvidia/llama-nemotron-embed-vl-1b-v2",
            input: text
        })
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error("OpenRouter Embeddings Error:", errorData);
        throw new Error(errorData.error?.message || "Failed to generate embeddings via OpenRouter");
    }

    const data = await res.json();
    const embedding: number[] = data.data?.[0]?.embedding || [];

    // If a storyId is provided, persist the resonance vector to the database
    if (storyId && embedding.length > 0) {
        await prisma.story.update({
            where: { id: storyId },
            data: {
                resonanceVector: embedding,
                resonanceMappedAt: new Date(),
            }
        });
    }

    return NextResponse.json({ 
        success: true, 
        embedding,
        dimensions: embedding.length,
        model_used: data.model,
        saved: storyId ? true : false,
    });

  } catch (error: any) {
    console.error("Embeddings Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
