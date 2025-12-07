import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, GroundingSource } from "../types";
import { GEMINI_MODEL } from "../constants";

// Helper interface for the raw response structure we expect
interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

export const analyzeLocation = async (
  lat: number,
  lng: number
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `I am currently at Latitude: ${lat}, Longitude: ${lng}. 
      
      Please identify my likely location (address, building, or area name) and tell me about 3-4 interesting places, restaurants, or services within walking distance of this specific location.
      
      Format the output clearly with bullet points.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          },
        },
      },
    });

    const text = response.text || "No analysis generated.";
    
    // Extract grounding sources from chunks
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    if (chunks) {
      chunks.forEach((chunk) => {
        if (chunk.maps?.uri) {
          sources.push({
            title: chunk.maps.title || "Google Maps Location",
            uri: chunk.maps.uri,
          });
        } else if (chunk.web?.uri) {
           sources.push({
            title: chunk.web.title || "Web Source",
            uri: chunk.web.uri,
          });
        }
      });
    }

    return {
      text,
      sources,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};