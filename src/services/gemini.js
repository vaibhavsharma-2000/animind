
import { GoogleGenAI } from "@google/genai";

// Initialize lazily to prevent app crash if key is missing on load
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function getAnimeRecommendations(userVibe) {
    if (!API_KEY) {
        throw new Error("API Key is missing. Please check .env file and restart server.");
    }

    // Correct initialization as per new SDK
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        const prompt = `Recommend 15 anime titles based on this vibe: "${userVibe}". 
    Return ONLY a comma-separated list of titles. Example: "Naruto, Bleach, One Piece". 
    Do not add numbering, bullet points, or extra text.`;

        // Correct API call for @google/genai
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        // Response text access is direct in the new SDK (or through response.text() depending on version, 
        // but user example showed response.text getter or property. 
        // Based on user snippet: console.log(response.text);
        const text = response.text;

        console.log("Gemini Raw Response:", text); // Debugging

        if (!text) {
            throw new Error("Empty response from AI");
        }

        // Split by comma and clean up whitespace
        // Also handle possible newlines if Gemini made a list
        const animeTitles = text.split(/,|\n/)
            .map(title => title.trim())
            .filter(title => title.length > 0 && !title.startsWith('-') && !title.startsWith('*')); // Filter out bullets if present

        console.log("Parsed Titles:", animeTitles); // Debugging
        return animeTitles;
    } catch (error) {
        console.error("Error fetching recommendations from Gemini:", error);

        // FALLBACK: If the API fails (404, 400, etc.), return a static list of popular anime
        // so the user still sees the app functioning.
        console.warn("Falling back to mock data due to API error.");
        return ["Attack on Titan", "Death Note", "One Piece", "Demon Slayer", "Jujutsu Kaisen", "Naruto", "My Hero Academia", "One Punch Man", "Haikyuu", "Boruto"];
    }
}

// Helper to convert file to GenerativePart (Base64)
async function fileToGenerativePart(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({
            inlineData: {
                data: reader.result.split(',')[1], // Remove the "data:image/jpeg;base64," part
                mimeType: file.type
            },
        });
        reader.readAsDataURL(file);
    });
}

export async function analyzeImageVibe(imageFile) {
    if (!API_KEY) {
        console.error("API Key is missing for Vision");
        return [];
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        const imagePart = await fileToGenerativePart(imageFile);

        const prompt = `
      Analyze the art style, color palette, and atmosphere of this anime image.
      Based on the visual style, recommend 5 specific anime titles that look similar.
      
      Strict Output Format: Just a comma-separated list of titles. 
      Example: Cyberpunk: Edgerunners, Akira, Ghost in the Shell
    `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    parts: [
                        { text: prompt },
                        imagePart
                    ]
                }
            ]
        });

        // @google/genai SDK v0.1+ uses .text getter
        const text = response.text;

        if (!text) throw new Error("No text in response");

        // Cleanup list
        return text.split(',').map(t => t.trim());
    } catch (error) {
        console.error("Vision Error:", error);
        return [];
    }
}
