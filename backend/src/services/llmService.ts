import { GoogleGenAI } from "@google/genai";
import { getPrompt, formatPrompt } from "../utils/promptUtils";

const getAI = (apiKey: string) => new GoogleGenAI({ apiKey });

export const generateEducationalContent = async (topic: string, level: string, description: string, apiKey: string) => {
  // Get the prompt template from prompts.md
  const promptTemplate = getPrompt('Educational Content Generation Prompt');
  
  // Format the prompt with the actual values
  const prompt = formatPrompt(promptTemplate, {
    topic,
    level,
    description: description || 'N/A'
  });

  try {
    const ai = getAI(apiKey);
    // Use generateContent directly with the prompt string
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (!response || !response.text) {
        // Check if there's safety feedback or other reasons for no text
        const candidate = response?.candidates?.[0];
        if (candidate?.finishReason && candidate.finishReason !== 'STOP') {
             console.error("Generation finished unexpectedly:", candidate.finishReason, candidate.safetyRatings);
             throw new Error(`Content generation failed or was blocked. Reason: ${candidate.finishReason}`);
        }
        // Log the full response if text is missing for unknown reasons
        console.error("Full response object:", JSON.stringify(response, null, 2));
        throw new Error("Response text is undefined or empty.");
    }

    const text = response.text; // Get the text content

     console.log("Raw response text:", text); // Keep for debugging if needed

    let cleanedResponse = text.trim();

    cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();


    try {
      JSON.parse(cleanedResponse); // Attempt to parse to validate format
      // console.log("Successfully validated JSON structure."); // Uncomment for debugging
    } catch (parseError) {
      console.error("Generated content is not valid JSON after cleaning:", parseError);
      console.error("Cleaned response content was:", cleanedResponse); // Log the bad data
      // Decide how to handle: throw error, return null, return the invalid string? Throwing is usually best.
      throw new Error("Failed to generate valid JSON content.");
    }

    return cleanedResponse; // Returns the JSON string containing HTML content

  } catch (error: any) {
    console.error("Error generating educational content:", error);
    // Check for specific API errors (like quota) if the SDK provides details
    if (error.message && error.message.includes('quota')) {
         console.error("Quota possibly exceeded. Check your API usage limits.");
    }
    // Rethrow or handle as appropriate for your application
    throw new Error(`Failed to generate educational content. Original error: ${error.message}`);
  }
};