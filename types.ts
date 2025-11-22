
export enum SkillLevel {
  Novice = 'Novice',
  Intermediate = 'Intermediate',
  Expert = 'Expert',
}

export enum ToolCategory {
  General = 'General',
  Woodworking = 'Woodworking',
  Baking = 'Baking',
  Cooking = 'Cooking',
  Textile = 'Textile',
  Crafting = 'Crafting',
  BasicSupplies = 'Basic Supplies',
}

export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
}

export interface Material {
  id: string;
  name: string;
  quantity: string;
  category: string;
}

export interface UserProfile {
  name: string;
  styles: string[]; // e.g., "Minimalist", "Cottagecore"
  styleDescription: string; // AI generated summary
  tools: string[]; // List of Tool IDs
  skills: Record<string, SkillLevel>; // e.g., { "Baking": "Expert" }
  perProjectBudget: number; // Average cost per project
  savedProjects?: Project[];
}

export interface DiyAlternative {
  material: string;
  instruction: string;
}

export interface Review {
  id: string;
  projectId: string;
  rating: number; // 1-5
  text: string;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Baking' | 'Crafts' | 'Home Decor' | 'Woodworking';
  timeEstimate: string;
  matchScore: number; // 0-100
  missingTools: string[];
  missingMaterials: string[];
  materials: string[]; // List of materials needed
  diyAlternatives?: DiyAlternative[]; // Suggestions for homemade materials
  steps: string[];
  color: string; // Tailwind class for background color
  imageUrl?: string; // Deprecated in favor of color
  costEstimate: number;
}

export interface SearchResult {
  title: string;
  uri: string;
  source?: string;
}

export interface StyleOption {
  id: string;
  name: string;
  color: string;
}

export type WeeklySchedule = Record<string, string[]>; // Key: "Monday", Value: [ProjectID]

export type ViewState = 'onboarding' | 'dashboard' | 'inventory' | 'project_detail' | 'calendar' | 'saved';
