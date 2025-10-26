
import { GoogleGenAI, Type } from "@google/genai";
import type { Analysis } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        diseaseName: {
            type: Type.STRING,
            description: "The common name of the identified disease or pest. If the plant is healthy, return 'Healthy'.",
        },
        confidenceScore: {
            type: Type.NUMBER,
            description: "A confidence score from 0.0 to 1.0 for the diagnosis. If healthy, this should be 1.0.",
        },
        analysis: {
            type: Type.STRING,
            description: "A detailed analysis of the symptoms and causes of the disease. If healthy, provide a brief confirmation.",
        },
        pesticideRecommendations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    dosage: { type: Type.STRING },
                    application: { type: Type.STRING },
                },
                required: ["name", "dosage", "application"],
            },
            description: "A list of recommended chemical pesticides. If healthy, return an empty array.",
        },
        organicAlternatives: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING,
            },
            description: "A list of organic or non-chemical treatment alternatives. If healthy, return an empty array.",
        },
    },
    required: ["diseaseName", "confidenceScore", "analysis", "pesticideRecommendations", "organicAlternatives"]
};


export async function analyzeCropImage(base64Image: string): Promise<Analysis> {
  const prompt = "You are an expert agricultural scientist specializing in paddy (rice) crop diseases. Analyze the provided image of a paddy crop. Identify any diseases or pests present. If the plant appears healthy, state that clearly. Provide a concise analysis, suggest specific pesticide recommendations (including dosage and application methods) and organic alternatives if a problem is detected. Provide a confidence score for your diagnosis. Structure your response strictly in the requested JSON format.";

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Image,
              },
            },
            {
              text: prompt
            }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.2,
        },
    });

    const jsonText = response.text.trim();
    const result: Analysis = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error("The image could not be processed due to safety settings. Please try a different image.");
    }
    throw new Error("Failed to get analysis from AI. Please try again.");
  }
}
