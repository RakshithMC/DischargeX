import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PatientData {
  patientName: string;
  age: string;
  gender: string;
  diagnosis: string;
  treatmentGiven: string;
  medications: string;
  doctorName: string;
  hospitalName: string;
  date: string;
}

export const parseVoiceInput = async (text: string): Promise<Partial<PatientData>> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract patient discharge details from the following text and return as JSON. 
      Text: "${text}"
      
      Fields to extract:
      - patientName
      - age
      - gender (Must be one of: "Male", "Female", "Other". ONLY extract if explicitly mentioned in the text. Do NOT infer from name or other context.)
      - diagnosis
      - treatmentGiven
      - medications
      - doctorName
      - hospitalName
      - date (format as YYYY-MM-DD if possible)
      
      If a field is not mentioned, leave it as an empty string.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patientName: { type: Type.STRING },
            age: { type: Type.STRING },
            gender: { 
              type: Type.STRING,
              description: "Must be 'Male', 'Female', or 'Other'. Only extract if explicitly mentioned."
            },
            diagnosis: { type: Type.STRING },
            treatmentGiven: { type: Type.STRING },
            medications: { type: Type.STRING },
            doctorName: { type: Type.STRING },
            hospitalName: { type: Type.STRING },
            date: { type: Type.STRING },
          },
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error parsing voice input:", error);
    return {};
  }
};

export const generateProfessionalSummary = async (data: PatientData): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional, structured medical discharge summary based on these details:
      ${JSON.stringify(data)}
      
      Format it with clear headings:
      1. Hospital Information
      2. Patient Identification
      3. Clinical Diagnosis
      4. Summary of Treatment
      5. Discharge Medications & Instructions
      6. Follow-up Advice
      
      Keep the tone professional and clinical.`,
    });

    return response.text || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Failed to generate summary.";
  }
};
