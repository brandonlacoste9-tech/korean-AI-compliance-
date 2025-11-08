import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Check for API key
    if (!process.env.XAI_API_KEY) {
      return res.status(500).json({ error: "XAI_API_KEY not configured" });
    }

    // Set headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const result = streamText({
      model: xai("grok-2-1212"),
      prompt: prompt,
    });

    // Stream the text response
    for await (const textPart of result.textStream) {
      res.write(`data: ${JSON.stringify({ text: textPart })}\n\n`);
    }

    res.end();
  } catch (error) {
    console.error("Error streaming from Grok:", error);
    res.status(500).json({ error: "Failed to stream text from Grok" });
  }
}
