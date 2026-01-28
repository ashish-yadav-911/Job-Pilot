import { GoogleGenAI, Type } from "@google/genai";
import { Job, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- Candidate Services ---

export interface MatchResult {
  matchScore: number;
  reason: string;
  isMatch: boolean;
  draftCoverLetter: string;
}

export const evaluateJobMatch = async (job: Job, profile: UserProfile, threshold: number): Promise<MatchResult> => {
  try {
    const prompt = `
      Act as a recruitment AI. 
      Candidate: ${JSON.stringify(profile)}
      Job: ${JSON.stringify(job)}
      
      Task:
      1. Score match 0-100.
      2. If score >= ${threshold}, isMatch = true.
      3. Short reasoning.
      4. Draft short cover letter.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            reason: { type: Type.STRING },
            isMatch: { type: Type.BOOLEAN },
            draftCoverLetter: { type: Type.STRING }
          },
          required: ["matchScore", "reason", "isMatch", "draftCoverLetter"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as MatchResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    return { matchScore: 0, reason: "Service Error", isMatch: false, draftCoverLetter: "" };
  }
};

// --- Employer Services ---

export interface SuggestedJobDetails {
  description: string;
  requirements: string[];
  salaryRange: string;
  experienceRequired: string;
}

export const suggestJobDetails = async (title: string, company: string): Promise<SuggestedJobDetails> => {
  try {
    const prompt = `
      I am an employer creating a job posting for a "${title}" at "${company}".
      Suggest a professional job description, a list of 5 key technical requirements, a competitive salary range (e.g. $100k - $120k), and required experience level (e.g. 3-5 years).
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
            salaryRange: { type: Type.STRING },
            experienceRequired: { type: Type.STRING }
          },
          required: ["description", "requirements", "salaryRange", "experienceRequired"]
        }
      }
    });

    return JSON.parse(response.text || '{}') as SuggestedJobDetails;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      description: "Could not generate suggestions.",
      requirements: ["Manual requirement entry needed"],
      salaryRange: "TBD",
      experienceRequired: "1-3 years"
    };
  }
};
