import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Server-side Gemini initialization
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route for transcript analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { transcript, customPrompt } = req.body;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length < 10) {
      return res.status(400).json({
        error: "Transcript is too short. Please provide a transcript with at least 10 characters.",
      });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an expert AI Meeting Assistant named MeetWise AI.
Analyze the provided meeting transcript with high accuracy and precision.

Extract and summarize:
1. meeting_title: Concise, descriptive title for the meeting.
2. meeting_objective: Main objective or goal of the meeting.
3. summary: High-level executive summary summarizing the context, major discussions, and key outcomes.
4. discussion_points: Array of key discussion topics/takeaways covered.
5. decisions: Array of clear decisions agreed upon or deferred/rejected during the meeting.
6. risks: Array of risks, bottlenecks, or infrastructure/timeline concerns raised.
7. open_questions: Array of unresolved questions or items requiring future follow-up.
8. action_items: Array of structured action items extracted from spoken commitments. Each action item must include:
   - task: Description of the task to be done.
   - owner: Person assigned or responsible for the task (if unknown, write "Unassigned").
   - due_date: Deadline or date mentioned (e.g. "July 30", "Next Tuesday", "Friday", "2024-10-11", or "Not Specified").
   - priority: Urgency level based on language - "High", "Medium", or "Low".
   - status: Default to "Pending".

Be thorough, precise, and extract real owners and deadlines mentioned in the speech.
Return ONLY a valid JSON object matching the requested schema.`;

    const userContent = customPrompt
      ? `Custom Focus Directive: ${customPrompt}\n\nTranscript:\n${transcript}`
      : `Transcript to analyze:\n${transcript}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userContent,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meeting_title: { type: Type.STRING },
            meeting_objective: { type: Type.STRING },
            summary: { type: Type.STRING },
            discussion_points: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            decisions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            risks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            open_questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            action_items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  owner: { type: Type.STRING },
                  due_date: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  status: { type: Type.STRING },
                },
                required: ["task", "owner", "due_date", "priority", "status"],
              },
            },
          },
          required: [
            "meeting_title",
            "meeting_objective",
            "summary",
            "discussion_points",
            "decisions",
            "risks",
            "open_questions",
            "action_items",
          ],
        },
      },
    });

    const responseText = response.text || "{}";
    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Error analyzing transcript:", error);
    return res.status(500).json({
      error: error?.message || "Failed to analyze meeting transcript with Gemini API.",
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
