import type { Context } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

export default async (req: Request, _context: Context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { transcript, customPrompt } = body;

    if (!transcript || typeof transcript !== "string" || transcript.trim().length < 10) {
      return new Response(
        JSON.stringify({
          error: "Transcript is too short. Please provide a transcript with at least 10 characters.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY environment variable is not configured on Netlify. Please add GEMINI_API_KEY in Netlify Site Settings > Environment Variables.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

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

    return new Response(JSON.stringify({ success: true, data: parsedData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error analyzing transcript in Netlify function:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Failed to analyze transcript." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
