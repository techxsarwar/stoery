"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, R2_BUCKET_NAME } from "@/lib/s3";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads a story cover image to Cloudflare R2.
 * Returns the public URL of the uploaded image.
 */
export async function uploadStoryCover(formData: FormData) {
  const file = formData.get("file") as File;
  
  if (!file) {
    return { error: "No file provided" };
  }

  // Validate file type (optional but recommended)
  if (!file.type.startsWith("image/")) {
    return { error: "Invalid file type. Please upload an image." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `covers/${uuidv4()}.${fileExt}`;
    
    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

    if (!publicUrlBase) {
      throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL is not configured.");
    }

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type, // Critical for browser rendering
    });

    await s3Client.send(command);

    return { 
      success: true, 
      url: `${publicUrlBase}/${fileName}` 
    };
  } catch (e: any) {
    console.error("R2 Upload Error Details:", {
      message: e.message,
      code: e.code,
      name: e.name,
      requestId: e.$metadata?.requestId
    });
    return { error: `Upload failed: ${e.message || "Unknown error"}` };
  }
}

/**
 * Uploads a codex entry image (Character, Map, Relic) to Cloudflare R2.
 */
export async function uploadCodexImage(formData: FormData) {
  const file = formData.get("file") as File;
  
  if (!file) {
    return { error: "No file provided" };
  }

  if (!file.type.startsWith("image/")) {
    return { error: "Invalid file type." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `codex/${uuidv4()}.${fileExt}`;
    
    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

    if (!publicUrlBase) {
      throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL is not configured.");
    }

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    return { 
      success: true, 
      url: `${publicUrlBase}/${fileName}` 
    };
  } catch (e: any) {
    console.error("R2 Codex Upload Error Details:", {
      message: e.message,
      code: e.code,
      name: e.name,
      requestId: e.$metadata?.requestId
    });
    return { error: `Codex forge failed: ${e.message || "Unknown error"}` };
  }
}

