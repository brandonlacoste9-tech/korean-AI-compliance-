import dotenv from "dotenv";
import { createXai } from "@ai-sdk/xai";
import { streamText } from "ai";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

async function main() {
  try {
    console.log("🤖 Streaming text from Grok AI...\n");
    console.log("API Key present:", !!process.env.XAI_API_KEY);

    // Create xAI provider with explicit API key
    const xai = createXai({
      apiKey: process.env.XAI_API_KEY,
    });

    const result = streamText({
      model: xai("grok-2-1212"),
      prompt: "Invent a new holiday and describe its traditions.",
    });

    let chunkCount = 0;
    let textChunkCount = 0;

    // Try using fullStream instead
    for await (const delta of result.fullStream) {
      chunkCount++;
      console.log(`\nChunk ${chunkCount} type:`, delta.type);
      console.log("Chunk data:", JSON.stringify(delta, null, 2));

      if (delta.type === "text-delta") {
        textChunkCount++;
        process.stdout.write(delta.textDelta);
      }
    }

    console.log("\n\n✅ Stream complete!");
    console.log(`📊 Total chunks: ${chunkCount}`);
    console.log(`📝 Text chunks: ${textChunkCount}`);
  } catch (error) {
    console.error("❌ Error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    process.exit(1);
  }
}

main();
