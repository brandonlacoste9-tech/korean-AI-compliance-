# Grok AI Integration

This project integrates xAI's Grok-2 model for AI-powered text generation.

## Setup

1. **Get your xAI API Key**
   - Visit https://console.x.ai/
   - Create an account or sign in
   - Generate an API key

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Add your xAI API key to `.env.local`:
     ```
     XAI_API_KEY=your_actual_xai_api_key_here
     ```

## Usage

### 1. API Route (Recommended for Production)

The API route at `/api/grok-stream` handles server-side streaming:

```typescript
const response = await fetch("/api/grok-stream", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Your prompt here"
  }),
});
```

### 2. Client-Side Service

Use the `grokService` for easy integration in React components:

```typescript
import { streamGrokText, generateGrokText } from "@/services/grokService";

// Streaming with real-time updates
streamGrokText({
  prompt: "Explain Korean AI regulations",
  onChunk: (text) => {
    console.log("Received chunk:", text);
    // Update UI in real-time
  },
  onComplete: (fullText) => {
    console.log("Complete text:", fullText);
  },
  onError: (error) => {
    console.error("Error:", error);
  },
});

// Simple async/await
const text = await generateGrokText("Your prompt here");
console.log(text);
```

### 3. Standalone Script

Run the example script to test Grok integration:

```bash
npm run grok:example
```

This will stream a response about inventing a new holiday.

## Example: React Component

```typescript
import { useState } from "react";
import { streamGrokText } from "@/services/grokService";

export default function GrokDemo() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setResponse("");

    streamGrokText({
      prompt: "Explain Korean AI compliance in simple terms",
      onChunk: (chunk) => {
        setResponse((prev) => prev + chunk);
      },
      onComplete: () => {
        setLoading(false);
      },
      onError: (error) => {
        console.error(error);
        setLoading(false);
      },
    });
  };

  return (
    <div>
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>
      <div>{response}</div>
    </div>
  );
}
```

## Features

- ✅ Server-side streaming for optimal performance
- ✅ Real-time text updates
- ✅ Type-safe TypeScript interfaces
- ✅ Error handling
- ✅ Environment variable configuration
- ✅ Easy-to-use service layer

## Model Information

- **Model**: `grok-2-1212`
- **Provider**: xAI
- **Capabilities**: Text generation, reasoning, creative writing

## API Reference

### `streamGrokText(options: GrokStreamOptions)`

Streams text from Grok with real-time chunk callbacks.

**Options:**
- `prompt` (string): The input prompt
- `onChunk?` (function): Called for each text chunk
- `onComplete?` (function): Called when streaming completes
- `onError?` (function): Called on error

### `generateGrokText(prompt: string): Promise<string>`

Generates text and returns the complete result as a Promise.

## Troubleshooting

### "XAI_API_KEY not configured"
- Ensure you've created `.env.local` from `.env.example`
- Verify your API key is correctly set
- Restart the dev server after adding environment variables

### Module not found errors
- Run `npm install` to ensure all dependencies are installed

### CORS errors
- The API route handles server-side calls, avoiding CORS issues
- Use the service layer which calls the API route internally

## Security Notes

- Never commit `.env.local` to version control
- API key is only used server-side (in API routes)
- The `XAI_API_KEY` is not prefixed with `NEXT_PUBLIC_` so it's not exposed to the client
