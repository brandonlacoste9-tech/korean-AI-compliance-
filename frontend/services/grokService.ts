/**
 * Grok AI Service
 * Client-side service for interacting with the Grok API
 */

export interface GrokStreamOptions {
  prompt: string;
  onChunk?: (text: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Stream text from Grok AI with real-time chunks
 */
export async function streamGrokText(options: GrokStreamOptions): Promise<void> {
  const { prompt, onChunk, onComplete, onError } = options;

  try {
    const response = await fetch("/api/grok-stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("No response body reader available");
    }

    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              fullText += data.text;
              onChunk?.(data.text);
            }
          } catch (e) {
            // Ignore parsing errors for incomplete chunks
          }
        }
      }
    }

    onComplete?.(fullText);
  } catch (error) {
    onError?.(error as Error);
  }
}

/**
 * Generate text from Grok AI and return the complete result
 */
export async function generateGrokText(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let fullText = "";

    streamGrokText({
      prompt,
      onChunk: (chunk) => {
        fullText += chunk;
      },
      onComplete: () => {
        resolve(fullText);
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
}
