import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  async generateBlogContent(topic: string): Promise<{ title: string; content: string }> {
    const ai = getClient();
    
    // We use gemini-2.5-flash for fast text generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a blog post about "${topic}". 
      Return the output as a JSON object with two keys: "title" (a catchy title) and "content" (the full blog post body, approx 300 words, formatted with standard line breaks).
      Do not include markdown code blocks in the output string, just the raw JSON string.`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      return {
        title: `Thoughts on ${topic}`,
        content: `(AI Generation failed to parse). Here is the raw output: ${text}`
      };
    }
  },

  async enhanceText(currentText: string): Promise<string> {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Proofread and enhance the following blog post text to be more engaging and professional:\n\n${currentText}`,
    });
    return response.text || currentText;
  }
};