
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Project, Material, SearchResult } from '../types';
import { PROJECT_COLORS } from '../constants';

// Lazily initialize the Gemini Client to prevent startup crashes on deployment.
let ai: GoogleGenAI | null = null;

/**
 * A safe, non-throwing function to check if the API key is present.
 * This is used by the root App component to prevent a blank-screen crash on deployment.
 */
export const isApiKeyConfigured = (): boolean => {
  const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;
  if (!apiKey) {
    console.warn("MakerMind Startup Warning: Gemini API Key is missing. The app will not be able to generate content. Please set the API_KEY environment variable in your deployment settings (e.g., Vercel).");
    return false;
  }
  return true;
};

const getAiClient = (): GoogleGenAI => {
  // This function is now called only after the initial check in App.tsx has passed.
  // The error throw is a fallback for any unexpected edge cases.
  if (!isApiKeyConfigured()) {
    throw new Error("AI Service is not configured. Please ensure the API key is set up correctly in your environment variables.");
  }
  
  const apiKey = process.env.API_KEY!; // We know it's available here.

  if (!ai) {
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};


/**
 * Analyzes selected style keywords to create a cohesive persona description.
 */
export const generateMakerPersona = async (styles: string[]): Promise<string> => {
  const modelId = 'gemini-2.5-flash';
  const prompt = `
    The user identifies with these design styles: ${styles.join(', ')}.
    Write a concise, 2-sentence description of their "Maker Persona" and aesthetic preferences.
    Focus on the vibe, color palette, and atmosphere they likely enjoy.
  `;

  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text || "A creative maker with a unique blend of styles.";
  } catch (error) {
    console.error("Error generating persona:", error);
    // Re-throw the error to be caught by the UI component
    if (error instanceof Error) throw error;
    throw new Error("A diverse creative spirit could not be generated.");
  }
};

/**
 * Helper to parse potentially Markdown-wrapped JSON
 */
const cleanAndParseJSON = (text: string) => {
    if (!text) return [];
    let cleaned = text.trim();
    
    // Remove markdown code blocks if present
    cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '');
    
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("JSON Parse failed", e);
        // Last ditch effort: find the first [ and last ]
        const firstBracket = cleaned.indexOf('[');
        const lastBracket = cleaned.lastIndexOf(']');
        
        if (firstBracket !== -1 && lastBracket !== -1) {
            try {
                const substring = cleaned.substring(firstBracket, lastBracket + 1);
                return JSON.parse(substring);
            } catch (e2) {
                console.error("Fallback JSON parse failed", e2);
                return [];
            }
        }
        return [];
    }
};

/**
 * Generates project recommendations based on user profile and inventory.
 */
export const getRecommendedProjects = async (
  profile: UserProfile,
  inventory: Material[]
): Promise<Project[]> => {
  const modelId = 'gemini-2.5-flash';

  const inventoryList = inventory.map(m => `${m.name} (${m.quantity})`).join(', ');
  const toolsList = profile.tools.join(', ');
  const skillsList = JSON.stringify(profile.skills);

  // Optimized prompt: Asking for 5 projects.
  // Constraints added to keep token count low per item to avoid truncation.
  const prompt = `
    You are "MakerMind". Suggest 5 DIY projects (Baking, Cooking, Crafts, Home Decor, Woodworking).
    
    Profile:
    - Style: ${profile.styleDescription}
    - Tools/Stash: ${toolsList}
    - Skills: ${skillsList}
    - Inventory: ${inventoryList}
    - Target Cost: ~$${profile.perProjectBudget} per project (Strict constraint)

    Constraints:
    1. Match aesthetic.
    2. Use inventory/tools if possible.
    3. Calc Match Score (0-100).
    4. Description max 15 words. (Be extremely concise)
    5. Max 3 steps per project. (Brief summary steps only)
    6. Missing materials list must be short.
    7. CRITICAL: If a required material (like clay, mod podge, buttermilk, oat flour, paint) can be made at home from scratch, provide a 'diyAlternatives' entry explaining how to make it.
    
    Return RAW JSON array.
  `;

  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              timeEstimate: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              missingTools: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
              materials: { type: Type.ARRAY, items: { type: Type.STRING } },
              diyAlternatives: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    material: { type: Type.STRING },
                    instruction: { type: Type.STRING }
                  }
                }
              },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } },
              costEstimate: { type: Type.NUMBER }
            }
          }
        }
      }
    });

    const rawProjects = cleanAndParseJSON(response.text);
    const projects = Array.isArray(rawProjects) ? rawProjects : [];
    
    return projects.map((p: any, i: number) => {
      // Assign a random vibrant color from the theme palette
      const randomColor = PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)];
      return {
        id: p.id || `gen-${Date.now()}-${i}`,
        title: p.title || 'Untitled Project',
        description: p.description || '',
        category: p.category || 'Crafts',
        timeEstimate: p.timeEstimate || '1h',
        matchScore: p.matchScore || 50,
        missingTools: Array.isArray(p.missingTools) ? p.missingTools : [],
        missingMaterials: Array.isArray(p.missingMaterials) ? p.missingMaterials : [],
        materials: Array.isArray(p.materials) ? p.materials : [],
        diyAlternatives: Array.isArray(p.diyAlternatives) ? p.diyAlternatives : [],
        steps: Array.isArray(p.steps) ? p.steps : [],
        costEstimate: p.costEstimate || 0,
        color: randomColor
      } as Project;
    });

  } catch (error) {
    console.error("Error generating projects:", error);
    if (error instanceof Error) throw error;
    return [];
  }
};

/**
 * Suggests a quick "Stash Buster" project based *only* on inventory.
 */
export const getStashBusterProject = async (inventory: Material[]): Promise<Project | null> => {
  const modelId = 'gemini-2.5-flash';
  const inventoryList = inventory.map(m => `${m.name} (${m.quantity})`).join(', ');

  if (inventory.length === 0) return null;

  const prompt = `
    Suggest ONE small, creative project using ONLY: ${inventoryList} (plus household basics like flour, salt, glue, water).
    Concise description (max 20 words). Max 4 steps.
    If you use a material like 'Clay' or 'Glue' that can be homemade, include it in diyAlternatives.
    Return RAW JSON object.
  `;

  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              timeEstimate: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              missingTools: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
              materials: { type: Type.ARRAY, items: { type: Type.STRING } },
              diyAlternatives: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    material: { type: Type.STRING },
                    instruction: { type: Type.STRING }
                  }
                }
              },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } },
              costEstimate: { type: Type.NUMBER }
           }
        }
      }
    });
    
    let text = response.text;
    if (!text) return null;
    
    // Robust cleaning for single object
    let cleaned = text.trim();
    cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '');

    const project = JSON.parse(cleaned) as any;
    
    const randomColor = PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)];
    
    return { 
      id: project.id || `stash-${Date.now()}`,
      title: project.title || 'Stash Buster',
      description: project.description || '',
      category: project.category || 'Crafts',
      timeEstimate: project.timeEstimate || '30m',
      matchScore: project.matchScore || 90,
      missingTools: Array.isArray(project.missingTools) ? project.missingTools : [],
      missingMaterials: Array.isArray(project.missingMaterials) ? project.missingMaterials : [],
      materials: Array.isArray(project.materials) ? project.materials : [],
      diyAlternatives: Array.isArray(project.diyAlternatives) ? project.diyAlternatives : [],
      steps: Array.isArray(project.steps) ? project.steps : [],
      costEstimate: project.costEstimate || 0,
      color: randomColor
    } as Project;

  } catch (error) {
    console.error("Stash buster error:", error);
    if (error instanceof Error) throw error;
    return null;
  }
};

/**
 * Finds real recipe or tutorial links using Google Search Grounding.
 */
export const findProjectResources = async (projectTitle: string, category: string): Promise<SearchResult[]> => {
  const modelId = 'gemini-2.5-flash';
  const searchTerm = category === 'Baking' 
    ? `recipe for ${projectTitle}` 
    : `tutorial how to make ${projectTitle}`;

  try {
    const client = getAiClient();
    const response = await client.models.generateContent({
      model: modelId,
      contents: `Find the best top 3 online tutorials or recipes for: "${projectTitle}".`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const results: SearchResult[] = [];

    // Extract URLs from grounding metadata
    chunks.forEach((chunk: any) => {
      if (chunk.web) {
        results.push({
          title: chunk.web.title,
          uri: chunk.web.uri
        });
      }
    });

    // De-duplicate by URI
    const uniqueResults = results.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);
    
    return uniqueResults.slice(0, 3); // Return top 3
  } catch (error) {
    console.error("Error finding resources:", error);
    if (error instanceof Error) throw error;
    return [];
  }
};
