import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const getAiResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> => {
    if (!process.env.API_KEY) {
        return Promise.resolve("AI functionality is disabled because the API key is not configured. Please set the `process.env.API_KEY` environment variable.");
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