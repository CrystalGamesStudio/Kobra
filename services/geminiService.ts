import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Get API key from environment variable (set by Vite)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("Gemini API_KEY environment variable not set. AI features will be disabled.");
}

// Only create AI instance if API key is available
let ai: GoogleGenAI | null = null;
if (API_KEY) {
    try {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
    }
}

const getAiResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> => {
    if (!API_KEY || !ai) {
        return Promise.resolve("AI functionality is disabled because the API key is not configured. Please set the `VITE_GEMINI_API_KEY` environment variable in a `.env` file.");
    }
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: "You are Chester, the AI sidekick on the Kobra platform. Your vibe is chill, a bit quirky, and you love memes. You're here to help creators with their projects, but don't take yourself too seriously. Keep your answers short, punchy, and add a bit of humor or a modern twist. No long paragraphs. Think witty one-liners, not essays. Your goal is to be a fun, helpful buddy, not a boring textbook. Let's make some cool stuff. 🐍",
            }
        });

        const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, I ran into a snag. Let's try that again.";
    }
};

export { getAiResponse };