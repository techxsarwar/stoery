import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
const pdfParse = require("pdf-parse");

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
        }

        // Read file contents as ArrayBuffer and convert to Buffer for pdf-parse
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Parse PDF using pdf-parse
        const data = await pdfParse(buffer);

        if (!data || !data.text) {
            return NextResponse.json({ error: "Failed to extract text from PDF" }, { status: 500 });
        }

        return NextResponse.json({ text: data.text });
    } catch (error: any) {
        console.error("PDF Upload Error:", error);
        return NextResponse.json({ error: error.message || "Failed to process PDF" }, { status: 500 });
    }
}
