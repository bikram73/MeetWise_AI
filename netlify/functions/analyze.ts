import type { Context } from "@netlify/functions";
import {
  executeMeetingAnalysis,
  MAX_TRANSCRIPT_CHARS,
} from "../../src/server/meetingAnalyzer";

// Serverless in-memory rate limiter per IP: max 30 requests per minute
const netlifyRequestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (netlifyRequestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  timestamps.push(now);
  netlifyRequestLog.set(ip, timestamps);
  return false;
}

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const clientIp =
      req.headers.get("x-nf-client-connection-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Too many requests. Please wait a moment before analyzing again.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { transcript, customPrompt } = body;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Please enter a meeting transcript.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (transcript.length > MAX_TRANSCRIPT_CHARS) {
      return new Response(
        JSON.stringify({
          success: false,
          error: `Transcript exceeds maximum allowed length of ${MAX_TRANSCRIPT_CHARS.toLocaleString()} characters.`,
        }),
        { status: 413, headers: { "Content-Type": "application/json" } }
      );
    }

    if (transcript.trim().length < 10) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Transcript is too short. Please provide a transcript with at least 10 characters.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const result = await executeMeetingAnalysis(transcript, customPrompt, apiKey);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || "Failed to analyze meeting transcript.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
