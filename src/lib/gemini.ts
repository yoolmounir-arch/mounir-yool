import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedContent, Level, ContentType } from "../types";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateGermanReading(
  level: Level,
  type: ContentType,
  topic: string
): Promise<Omit<GeneratedContent, 'id' | 'createdAt' | 'level' | 'contentType' | 'topic'>> {
  const prompt = `Generate a German reading text for learners at level ${level}. Content type: ${type}. Topic: ${topic || 'surprise me'}. Use natural and grammatically correct German. Then provide a full Arabic translation and 10–15 important vocabulary words with Arabic meanings, simple German examples, and Arabic translations. Return structured JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Title of the text in German"
          },
          germanText: {
            type: Type.STRING,
            description: "The generated German text, separated by paragraphs using \n\n"
          },
          arabicTranslation: {
            type: Type.STRING,
            description: "The full Arabic translation of the text, separated by paragraphs using \n\n"
          },
          vocabulary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                german: { type: Type.STRING },
                arabicMeaning: { type: Type.STRING },
                exampleGerman: { type: Type.STRING },
                exampleArabic: { type: Type.STRING }
              },
              required: ["german", "arabicMeaning", "exampleGerman", "exampleArabic"]
            }
          }
        },
        required: ["title", "germanText", "arabicTranslation", "vocabulary"]
      }
    }
  });

  if (!response.text) {
    throw new Error("Failed to generate content. Please try again.");
  }

  const data = JSON.parse(response.text);
  return data;
}
