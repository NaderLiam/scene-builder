export interface OptionSet {
  label: string;
  value: string;
  tags?: string[];
  eraScope?: string[];
  userScope?: string[];
}

// OptionMap now includes keys for fields that are genuinely 'select' type
// with predefined options. Free-text fields like 'subject', 'details' are not here.
export type OptionMap = Partial<Record<
  | "era"
  | "location"
  | "timeOfDay"
  | "lighting"
  | "mood"
  | "weather"
  | "palette"
  | "cameraAngle"
  | "lens"
  | "aperture"
  | "artisticStyle"
  | "aspectRatio"
  | "keyElements", // Added keyElements
  OptionSet[]
>>;

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect'; // Added 'multiselect'
  placeholder?: string;
  optionsKey?: keyof OptionMap;
  allowCustom?: boolean;
  defaultValue?: string | string[];
}

export interface FormGroup {
  id: string;
  title: string;
  fields: FormField[];
}

export type PromptDataValue = string | string[];
export type PromptData = Record<string, PromptDataValue> & {
    aspectRatio?: string; 
    keyElements?: string[]; // Added keyElements to store selected values
};

// Represents the data for a single shot, specific to that shot
export interface ShotSpecificData {
  subject?: string[]; // Main Subject(s) / Action
  cameraAngle?: string;
  lens?: string;
  aperture?: string;
  details?: string[]; // Specific Details/Objects
  selectedCreativeConceptId?: string; // For Impact Lab
  // Other shot-specific fields as needed
}

export interface Shot {
  id: string;
  sceneId: string; // Link back to the parent scene
  shotSpecificData: ShotSpecificData; // Fields unique to this shot (includes selectedCreativeConceptId)
  generatedPrompt: string; // The full prompt (Scene DNA + Shot Specifics)
  timestamp: number;
  name?: string; // Optional name for the shot itself
  previewImageUrl?: string;
}

export interface Scene {
  id: string;
  title: string;
  // Scene DNA: Core settings for the entire scene
  dna: PromptData; // Contains era, location, mood, lighting, aspectRatio, keyElements etc.
  storyboard: Shot[]; // Sequence of shots for this scene
  timestamp: number;
  isUserDefined?: boolean; // For templates
}

// SceneTemplate: Stores the Scene's DNA and title for reuse.
export interface SceneTemplate {
  id: string;
  name: string; // Template name
  sceneTitle: string; // Default title for a new scene created from this template
  sceneDna: PromptData; // The core DNA to be applied, including aspectRatio and keyElements
  isUserDefined?: boolean;
}


export type Theme = 'light' | 'dark';
export type Direction = 'ltr' | 'rtl';

export interface DocContent {
  [key: string]: {
    title: string;
    content: string;
  };
}

export interface CustomOptionPayload {
  fieldId: keyof OptionMap;
  label: string;
  value: string;
  eraScope?: string[];
}

export type View = 'home' | 'sceneSettings' | 'storyboard';

// Impact Lab Types
export interface CreativeConceptCategory {
  id: string;
  title: string;
  description: string;
}

export interface CreativeConcept {
  id: string;
  title: string; // e.g., 'Object-Embedded POV (منظور الجماد)'
  psychologicalEffect: string;
  promptSnippet: string;
  category: string; // ID of CreativeConceptCategory
}