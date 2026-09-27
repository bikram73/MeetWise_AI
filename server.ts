import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import {
  executeMeetingAnalysis,
  MAX_TRANSCRIPT_CHARS,
} from "./src/server/meetingAnalyzer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// In-memory rate limiter: maximum 30 requests per minute per IP
const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

function rateLimitMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: "Too many requests. Please wait a moment before analyzing again.",
    });
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  next();
}

// API Route for transcript analysis
app.post("/api/analyze", rateLimitMiddleware, async (req, res) => {
  try {
    const { transcript, customPrompt } = req.body;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please enter a meeting transcript.",
      });
    }

    if (transcript.length > MAX_TRANSCRIPT_CHARS) {
      return res.status(413).json({
        success: false,
        error: `Transcript exceeds maximum allowed length of ${MAX_TRANSCRIPT_CHARS.toLocaleString()} characters.`,
      });
    }

    if (transcript.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: "Transcript is too short. Please provide a transcript with at least 10 characters.",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const result = await executeMeetingAnalysis(transcript, customPrompt, apiKey);

    return res.json(result);
  } catch (error: any) {
    console.error("Error analyzing transcript:", error);
    return res.status(500).json({
      success: false,
      error:
        error?.message?.replace(/\{"error":\{.*\}\}/g, "API quota limit reached. Please wait a moment.") ||
        "Failed to analyze meeting transcript.",
    });
  }
});

// Start Express server with Vite middleware in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MeetWise AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
