import { S3Client } from "@aws-sdk/client-s3";

let _s3Client: S3Client | null = null;

/**
 * Returns a lazily-initialized S3Client pointed at Cloudflare R2.
 * Reading env vars here (instead of at module load) guarantees they are
 * already set by Next.js before this code runs.
 */
export function getS3Client(): S3Client {
  if (_s3Client) return _s3Client;

  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error(
      `R2 storage credentials missing. Check R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY.\n` +
      `Current values: endpoint=${endpoint}, key=${accessKeyId ? "set" : "MISSING"}, secret=${secretAccessKey ? "set" : "MISSING"}`
    );
  }

  _s3Client = new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true, // Required for Cloudflare R2
    credentials: { accessKeyId, secretAccessKey },
  });

  return _s3Client;
}

export const R2_BUCKET_NAME = () => process.env.R2_BUCKET_NAME || "globalpulse";
