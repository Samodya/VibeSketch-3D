import { GoogleGenAI, Modality } from "@google/genai";

const stripBase64Prefix = (base64: string): string => {
  return base64.split(',')[1];
};

let ai: GoogleGenAI | null = null;
const getAI = () => {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const generateImageFromSketch = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const aiInstance = getAI();
    const imagePart = {
      inlineData: {
        mimeType: 'image/png',
        data: stripBase64Prefix(base64Image),
      },
    };
    
    // A more direct prompt to emphasize the sketch
    let textPrompt = "This image is a user's drawing. Convert this sketch into a detailed 3D digital artwork. Faithfully interpret the shapes and objects drawn.";
    if (prompt && prompt.trim() !== '') {
        // Append user's style prompt
        textPrompt += ` Apply the following style and details: "${prompt}"`;
    }

    const textPart = {
      text: textPrompt,
    };

    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
      return `data:image/png;base64,${firstPart.inlineData.data}`;
    }
    throw new Error('No image was generated.');
  } catch (error) {
    console.error("Error generating image from sketch:", error);
    throw error;
  }
};


export const editImageWithPrompt = async (base64Image: string, prompt: string): Promise<string> => {
  try {
    const aiInstance = getAI();
    const imagePart = {
      inlineData: {
        mimeType: 'image/png',
        data: stripBase64Prefix(base64Image),
      },
    };
    const textPart = {
      text: prompt,
    };

    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
      return `data:image/png;base64,${firstPart.inlineData.data}`;
    }
    throw new Error('No image was generated for editing.');
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};


export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    try {
      const aiInstance = getAI();
      const response = await aiInstance.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: prompt }] },
          config: {
              responseModalities: [Modality.IMAGE],
          },
      });

      const firstPart = response.candidates?.[0]?.content?.parts?.[0];
      if (firstPart && firstPart.inlineData) {
          return `data:image/png;base64,${firstPart.inlineData.data}`;
      }
      throw new Error('No image was generated from prompt.');
    } catch (error) {
        console.error("Error generating image from prompt:", error);
        throw error;
    }
};