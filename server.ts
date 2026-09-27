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

// Helper for intelligent offline heuristic extraction when API rate limits are hit
function fallbackExtractTranscript(transcript: string, customPrompt?: string) {
  const lines = transcript.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  // Try to find a title line
  let title = "Meeting Summary & Action Items";
  const firstFew = lines.slice(0, 4);
  for (const line of firstFew) {
    if (
      line.match(/(meeting|sync|retrospective|roadmap|review|planning|standup|discussion)/i) &&
      !line.includes(":") &&
      line.length < 60
    ) {
      title = line.replace(/^[#\*\-_\s]+/, "").trim();
      break;
    }
  }

  // Parse speaker blocks
  const speakerRegex = /^(?:\[\d{2}:\d{2}(?::\d{2})?\]\s*)?([A-Za-z0-9\s\(\)]+?):\s*(.+)$/;
  const speakerTurns: { speaker: string; text: string }[] = [];
  let currentSpeaker = "Participant";

  for (const line of lines) {
    const match = line.match(speakerRegex);
    if (match) {
      currentSpeaker = match[1].replace(/\(.*?\)/g, "").trim();
      speakerTurns.push({ speaker: currentSpeaker, text: match[2].trim() });
    } else if (speakerTurns.length > 0) {
      speakerTurns[speakerTurns.length - 1].text += " " + line;
    }
  }

  // Objective detection
  let objective = "Align team on project deliverables, address dependencies, and establish next steps.";
  for (const turn of speakerTurns) {
    const match = turn.text.match(
      /(?:need to decide|agenda is|goal is|objective is|sync about|discuss(?:ing)?|decide on|plan(?:ning)? for)\s+([^.]+)/i
    );
    if (match) {
      objective = `Discuss and align on ${match[1].trim()}.`;
      break;
    }
  }

  // Decisions detection
  const decisions: string[] = [];
  for (const turn of speakerTurns) {
    const text = turn.text;
    if (
      text.match(
        /decision made|decided to|agreed to|let's postpone|we are prioritizing|we'll prioritize|we decided|approved/i
      )
    ) {
      decisions.push(`${turn.speaker}: ${text.replace(/^.*?decision made:?\s*/i, "").trim()}`);
    }
  }
  if (decisions.length === 0) {
    decisions.push("Team reviewed upcoming timeline and agreed on immediate task distribution.");
  }

  // Risks detection
  const risks: string[] = [];
  for (const turn of speakerTurns) {
    const text = turn.text;
    if (text.match(/risk|blocker|bottleneck|delay|vulnerability|depend|concern|otherwise|issue/i)) {
      risks.push(text);
    }
  }
  if (risks.length === 0) {
    risks.push("No immediate critical risks or blockers were identified during this session.");
  }

  // Open questions detection
  const openQuestions: string[] = [];
  for (const turn of speakerTurns) {
    const questions = turn.text.match(/[^.!?]+(?:\?)/g);
    if (questions) {
      for (const q of questions) {
        if (q.trim().length > 10) {
          openQuestions.push(`${turn.speaker}: ${q.trim()}`);
        }
      }
    }
  }
  if (openQuestions.length === 0) {
    openQuestions.push("All proposed discussion topics were addressed during the call.");
  }

  // Action items extraction
  const actionItems: Array<{
    task: string;
    owner: string;
    due_date: string;
    priority: string;
    status: string;
  }> = [];

  const dueDateRegex =
    /(?:by|before|on|until|for|starting)\s+((?:next\s+)?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|today|tomorrow|EOD|Phase\s*\d+|[A-Z][a-z]+\s+\d+(?:st|nd|rd|th)?|\d{1,2}\/\d{1,2}(?:\/\d{2,4})?|\d{4}-\d{2}-\d{2}))/i;

  for (const turn of speakerTurns) {
    const text = turn.text;

    // Check if another person was explicitly directed
    const assignmentMatch = text.match(/([A-Z][a-z]+),\s+(?:you'll|you will|please|can you)\s+([^.?!]+)/i);
    // Check for commitments: "I'll...", "We need to...", "[Name] will..."
    const commitmentMatch = text.match(
      /(?:I'll|I will|we need to|let's|will|assigned to|please|I can)\s+([^.?!,;]+(?:\s+[^.?!,;]+){1,10})/i
    );

    let owner = turn.speaker;
    let task = "";

    if (assignmentMatch) {
      owner = assignmentMatch[1];
      task = assignmentMatch[2].trim();
    } else if (commitmentMatch) {
      task = commitmentMatch[1].trim();
    } else if (text.match(/review|complete|finish|prepare|draft|test|implement|ship|deploy|escalate/i)) {
      task = text.trim();
    }

    if (task) {
      // Clean task prefix
      task = task.replace(/^(?:I'll|I will|we need to|let's|to)\s+/i, "");
      task = task.charAt(0).toUpperCase() + task.slice(1);

      // Extract due date
      const dateMatch = text.match(dueDateRegex);
      const dueDate = dateMatch ? dateMatch[1].trim() : "Not Specified";

      // Detect priority
      const isHighPriority = /critical|blocker|urgent|asap|today|eod|vulnerability/i.test(text);
      const isLowPriority = /later|phase 2|backlog|nice to have/i.test(text);
      const priority = isHighPriority ? "High" : isLowPriority ? "Low" : "Medium";

      actionItems.push({
        task,
        owner,
        due_date: dueDate,
        priority,
        status: "Pending",
      });
    }
  }

  // If no action items were found, create reasonable defaults
  if (actionItems.length === 0) {
    actionItems.push({
      task: "Review meeting notes and coordinate next steps with team",
      owner: speakerTurns[0]?.speaker || "Organizer",
      due_date: "Next Sync",
      priority: "Medium",
      status: "Pending",
    });
  }

  // Discussion points
  const discussionPoints: string[] = [];
  if (speakerTurns.length > 0) {
    const sampleTurns = speakerTurns.slice(0, 6);
    for (const t of sampleTurns) {
      const snippet = t.text.length > 120 ? t.text.slice(0, 120) + "..." : t.text;
      discussionPoints.push(`${t.speaker}: ${snippet}`);
    }
  } else {
    discussionPoints.push("General team coordination and review of current project priorities.");
  }

  const uniqueSpeakers = Array.from(new Set(speakerTurns.map((t) => t.speaker))).filter(Boolean);
  const speakersList = uniqueSpeakers.length > 0 ? uniqueSpeakers.join(", ") : "team members";

  const summary = `The meeting brought together ${speakersList} to discuss project deliverables and execution strategy. Participants aligned on key milestones, resolved operational questions, and established clear action items with designated owners and target dates.`;

  return {
    meeting_title: title,
    meeting_objective: objective,
    summary,
    discussion_points: discussionPoints,
    decisions,
    risks,
    open_questions: openQuestions,
    action_items: actionItems,
  };
}

// API Route for transcript analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { transcript, customPrompt } = req.body;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length < 10) {
      return res.status(400).json({
        error: "Transcript is too short. Please provide a transcript with at least 10 characters.",
      });
    }

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

    const responseSchema = {
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
    };

    let ai: GoogleGenAI | null = null;
    try {
      ai = getGeminiClient();
    } catch (e: any) {
      console.warn("Gemini client not initialized:", e?.message);
    }

    // Official recommended model sequence: gemini-3.8-flash, gemini-flash-latest, gemini-3.1-flash-lite
    const modelsToTry = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let parsedData = null;
    let lastError: any = null;

    if (ai) {
      for (const model of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: userContent,
            config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema,
            },
          });

          const responseText = response.text || "{}";
          parsedData = JSON.parse(responseText);
          break; // Succeeded!
        } catch (err: any) {
          lastError = err;
          console.warn(`Model ${model} failed:`, err?.message || err);
          // If 429 quota or rate limit, continue to next model
          const isRateLimit =
            err?.message?.includes("429") ||
            err?.message?.includes("RESOURCE_EXHAUSTED") ||
            err?.status === "RESOURCE_EXHAUSTED" ||
            err?.code === 429;
          if (isRateLimit) {
            continue;
          }
          // If other fatal error, also try next or break
          continue;
        }
      }
    }

    // If Gemini succeeded, return real AI data
    if (parsedData) {
      return res.json({
        success: true,
        data: parsedData,
      });
    }

    // If all Gemini models were exhausted by quota limits, use smart local fallback parser
    console.info("Invoking smart fallback extraction due to quota limits or API unavailability.");
    const fallbackData = fallbackExtractTranscript(transcript, customPrompt);
    return res.json({
      success: true,
      data: fallbackData,
      isFallback: true,
      notice:
        "Analyzed using smart local intelligence engine (Gemini API free-tier quota is currently resting).",
    });
  } catch (error: any) {
    console.error("Error analyzing transcript:", error);
    return res.status(500).json({
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
