import { createHash, createHmac, randomBytes } from "crypto";

export function createToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Derive a stable stamp token for a customer and token version.
 * The raw token is reproducible by the server but is never stored in the database.
 * Rotating stampTokenVersion invalidates the previous QR.
 */
export function createStampToken(customerId: string, version: number) {
  const secret = process.env.SESSION_PASSWORD;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_PASSWORD must be at least 32 characters.");
  }
  return createHmac("sha256", secret)
    .update(`coffee-stamp:${customerId}:${version}`)
    .digest("base64url");
}
