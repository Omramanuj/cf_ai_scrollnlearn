"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEducationalContent = void 0;
const genai_1 = require("@google/genai");
const dotenv_1 = __importDefault(require("dotenv"));
const promptUtils_1 = require("../utils/promptUtils");
dotenv_1.default.config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const generateEducationalContent = (topic, level, description) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Get the prompt template from prompts.md
    const promptTemplate = promptUtils_1.getPrompt('Educational Content Generation Prompt');
    
    // Format the prompt with the actual values
    const prompt = promptUtils_1.formatPrompt(promptTemplate, {
        topic,
        level,
        description: description || 'N/A'
    });
    try {
        // Use generateContent directly with the prompt string
        const response = yield ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        if (!response || !response.text) {
            // Check if there's safety feedback or other reasons for no text
            const candidate = (_a = response === null || response === void 0 ? void 0 : response.candidates) === null || _a === void 0 ? void 0 : _a[0];
            if ((candidate === null || candidate === void 0 ? void 0 : candidate.finishReason) && candidate.finishReason !== 'STOP') {
                console.error("Generation finished unexpectedly:", candidate.finishReason, candidate.safetyRatings);
                throw new Error(`Content generation failed or was blocked. Reason: ${candidate.finishReason}`);
            }
            // Log the full response if text is missing for unknown reasons
            console.error("Full response object:", JSON.stringify(response, null, 2));
            throw new Error("Response text is undefined or empty.");
        }
        const text = response.text; // Get the text content
        console.log("Raw response text:", text); // Keep for debugging if needed
        // Clean the response - remove potential markdown code block indicators and surrounding whitespace
        let cleanedResponse = text.trim();
        // More robust cleaning: handles optional 'json' language identifier and potential leading/trailing whitespace/newlines around backticks
        cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();
        try {
            JSON.parse(cleanedResponse); // Attempt to parse to validate format
            // console.log("Successfully validated JSON structure."); // Uncomment for debugging
        }
        catch (parseError) {
            console.error("Generated content is not valid JSON after cleaning:", parseError);
            console.error("Cleaned response content was:", cleanedResponse); // Log the bad data
            // Decide how to handle: throw error, return null, return the invalid string? Throwing is usually best.
            throw new Error("Failed to generate valid JSON content.");
        }
        return cleanedResponse; // Returns the JSON string containing HTML content
    }
    catch (error) {
        console.error("Error generating educational content:", error);
        // Check for specific API errors (like quota) if the SDK provides details
        if (error.message && error.message.includes('quota')) {
            console.error("Quota possibly exceeded. Check your API usage limits.");
        }
        // Rethrow or handle as appropriate for your application
        throw new Error(`Failed to generate educational content. Original error: ${error.message}`);
    }
});
exports.generateEducationalContent = generateEducationalContent;
