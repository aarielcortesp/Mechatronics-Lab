
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIFeedback = async (prompt: string, context: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        {
          text: `You are an expert Mechatronics Engineering Professor. Provide constructive feedback on the following project context: ${JSON.stringify(context)}. User prompt: ${prompt}. Focus on requirements analysis, physics-based modeling (derivatives/integrals), and Arduino programming.`
        }
      ],
      config: {
        thinkingConfig: { thinkingBudget: 15000 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, hubo un error al procesar tu consulta con la IA. Por favor, intenta de nuevo.";
  }
};

export const generateArduinoSnippet = async (components: string[], logic: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a basic Arduino code for a mechatronics project using these components: ${components.join(', ')}. Logic: ${logic}. Include comments explaining the control logic.`
  });
  return response.text;
};

export const analyzeMathModel = async (physicsConcept: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Explain the mathematical model for ${physicsConcept} in mechatronics. Use LaTeX notation for integrals and derivatives. Explain how to apply it to a real system.`
  });
  return response.text;
};
