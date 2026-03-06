import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_GENAI_API_KEY || "";

// Initialize only if key exists to avoid immediate errors, handle checks later
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateCreativeSpark = async (
  industry: string,
  vibe: string
): Promise<string> => {
  if (!ai) {
    return "The Creative Oracle is currently sleeping (API Key missing). Imagine something bold!";
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the bold, creative spirit of 'Excelsior Creative', a top-tier digital agency. 
      Generate a short, punchy, 2-sentence brand manifesto or slogan for a client in the '${industry}' industry who wants a '${vibe}' vibe. 
      Make it sound powerful, like a lion's roar. Do not use quotes.`,
      config: {
        maxOutputTokens: 100,
        temperature: 1.2, // High creativity
      },
    });

    return response.text || "Ignite your potential.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our creative circuits are overloaded. Try again in a moment.";
  }
};
