import { FormGroup, SceneTemplate, DocContent, OptionSet, CreativeConceptCategory, CreativeConcept } from './types';

export const APP_TITLE = "Historical-Scene Prompt Builder";

export const ASPECT_RATIO_OPTIONS: OptionSet[] = [
  { label: "16:9 (Widescreen)", value: "16:9" },
  { label: "21:9 (Cinematic)", value: "21:9" },
  { label: "9:16 (Vertical)", value: "9:16" },
  { label: "1:1 (Square)", value: "1:1" },
  { label: "4:3 (Classic TV)", value: "4:3" },
  { label: "3:2 (Photography)", value: "3:2" },
];

// Fields defining the core "DNA" of a Scene
export const SCENE_DNA_STRUCTURE: FormGroup[] = [
  {
    id: 'sceneMeta',
    title: 'Scene Identity & Configuration', // Renamed for clarity
    fields: [
      // Scene Title will be a separate input field in the SceneSettingsPage, not part of this structure for form generation.
      // It's handled directly in SceneSettingsPage.
      { 
        id: 'aspectRatio', 
        label: 'Aspect Ratio', 
        type: 'select', 
        optionsKey: 'aspectRatio', 
        defaultValue: "16:9", 
        placeholder: 'Select aspect ratio for all shots' 
      },
    ],
  },
  {
    id: 'sceneFoundation',
    title: 'Scene DNA: Foundation',
    fields: [
      { id: 'era', label: 'Historical Era/Period', type: 'select', optionsKey: 'era', defaultValue: "", allowCustom: true, placeholder: 'Select or type custom era...' },
      { id: 'location', label: 'Location/Setting', type: 'select', optionsKey: 'location', defaultValue: "", allowCustom: true, placeholder: 'Select or type custom location...' },
      { id: 'timeOfDay', label: 'Time of Day', type: 'select', optionsKey: 'timeOfDay', defaultValue: "", allowCustom: true, placeholder: 'Select or type custom time...' },
    ],
  },
  {
    id: 'sceneKeyElements', // New Group for Key Elements
    title: 'Key Scene Elements',
    fields: [
      {
        id: 'keyElements', // This ID will be used in PromptData.keyElements
        label: 'Select Key Elements', // Label for the MultiSelectInput
        type: 'multiselect',       // New type for MultiSelectInput
        optionsKey: 'keyElements', // Corresponds to key in OptionMap (PROMPT_OPTIONS_DATA)
        defaultValue: [],          // Default to an empty array for multiple selections
        placeholder: 'Add elements relevant to the scene era...',
        // allowCustom might be false for Key Elements initially, as they are predefined detailed descriptions.
        // If true, custom key elements would need careful handling for their 'value' (the description).
      },
    ],
  },
  {
    id: 'sceneAtmosphere',
    title: 'Scene DNA: Atmosphere',
    fields: [
      { id: 'mood', label: 'Overall Mood', type: 'select', optionsKey: 'mood', defaultValue: "", allowCustom: true, placeholder: 'Select or type custom mood...' },
      { id: 'lighting', label: 'Lighting Style', type: 'select', optionsKey: 'lighting', defaultValue: "", allowCustom: true, placeholder: 'Select or type custom lighting...' },
      { id: 'weather', label: 'Weather Conditions', type: 'select', optionsKey: 'weather', defaultValue: "", allowCustom: true, placeholder: 'e.g., light rain, clear sky (can be custom)' },
      { id: 'palette', label: 'Color Palette', type: 'select', optionsKey: 'palette', defaultValue: "", allowCustom: true, placeholder: 'Select or type custom palette...' },
    ],
  },
  {
    id: 'sceneArtistry',
    title: 'Scene DNA: Artistry & Tone',
    fields: [
      { id: 'artisticStyle', label: 'Artistic Style/Medium', type: 'select', optionsKey: 'artisticStyle', defaultValue: "", allowCustom: true, placeholder: 'Select or type custom style...' },
      { id: 'inspiration', label: 'Inspirations (Artists/Works)', type: 'text', placeholder: 'e.g., inspired by Rembrandt, style of Akira Kurosawa', defaultValue: [] },
      { id: 'negativePrompt', label: 'Negative Prompts (Scene Level)', type: 'text', placeholder: 'e.g., modern elements, text, watermark', defaultValue: [] },
    ],
  },
];

// Fields specific to an individual Shot within a Scene's Storyboard
export const SHOT_SPECIFIC_STRUCTURE: FormGroup[] = [
  {
    id: 'shotComposition',
    title: 'Shot Composition',
    fields: [
      { id: 'subject', label: 'Main Subject(s) / Action', type: 'textarea', placeholder: 'e.g., A merchant presents a rare spice to a scholar. Two warriors clash swords.', defaultValue: [] },
      { id: 'cameraAngle', label: 'Camera Angle/View', type: 'select', optionsKey: 'cameraAngle', defaultValue: "", allowCustom: true, placeholder: 'Select or type custom angle...' },
      { id: 'lens', label: 'Lens Type/Focal Length', type: 'select', optionsKey: 'lens', defaultValue: "", allowCustom: true, placeholder: 'Select or type custom lens...' },
      { id: 'aperture', label: 'Aperture/Depth of Field', type: 'select', optionsKey: 'aperture', defaultValue: "", allowCustom: true, placeholder: 'Select or type custom aperture...' },
      { id: 'details', label: 'Specific Details/Objects (Shot Level)', type: 'textarea', placeholder: 'e.g., a specific expression, an object in hand, foreground elements', defaultValue: [] },
    ],
  },
];


export const DEFAULT_SCENE_TEMPLATES: SceneTemplate[] = [
  {
    id: 'template-scene-1',
    name: 'Baghdad Golden Hour Bazaar Scene',
    sceneTitle: 'Baghdad Bazaar at Golden Hour',
    sceneDna: {
      aspectRatio: '16:9',
      era: 'abbasid', 
      location: 'house_of_wisdom', 
      timeOfDay: 'golden_hour',
      mood: 'bustling_market',
      lighting: 'cinematic_lighting',
      palette: 'rich_jewel_tones',
      artisticStyle: 'orientalist_oil_painting',
      inspiration: ["1001 Nights illustrations"],
      negativePrompt: ["text, watermarks, modern clothing"],
      keyElements: [], // Initialize for new templates
    },
    isUserDefined: false,
  },
  {
    id: 'template-scene-2',
    name: 'Feudal Japan Cherry Blossom Scene',
    sceneTitle: 'Samurai Meditation in Spring',
    sceneDna: {
      aspectRatio: '21:9',
      era: 'edo_japan', 
      location: 'serene_temple_garden', 
      timeOfDay: 'spring_morning', 
      mood: 'peaceful_serene',
      artisticStyle: 'ukiyo_e_woodblock',
      weather: 'clear_sky_cherry_blossoms_falling', 
      negativePrompt: ["people in background, modern structures"],
      keyElements: [], // Initialize for new templates
    },
    isUserDefined: false,
  },
];

export const DOCS_CONTENT: DocContent = {
  welcome: {
    title: "Welcome!",
    content: "This tool helps you build detailed prompts for AI image generators. Create a 'Scene' to define its core DNA (including aspect ratio and key elements), then build a 'Storyboard' of shots within that scene. Explore scene templates and save your creations."
  },
  sceneDNA: {
    title: "Scene DNA",
    content: "Scene DNA sets the foundational elements for your entire scene: aspect ratio, era, location, mood, lighting, artistic style, key elements, etc. These are defined once per scene. Key Elements are injected into each shot's subject."
  },
  storyboard: {
    title: "Storyboard & Shots",
    content: "The Storyboard is where you build the narrative sequence for your scene. Each 'Shot' has its own specific details (like subject, camera angle) that combine with the Scene DNA (including injected Key Elements) to generate a unique prompt. The scene's aspect ratio is automatically applied."
  },
  eraHint: {
    title: "Historical Era Hint",
    content: "Selecting an era can filter options in other fields (e.g., palettes, locations, key elements) to be more contextually appropriate for your Scene DNA. You can also type a custom era."
  },
  customOption: {
    title: "Adding a Custom Option",
    content: "If you select 'Custom...' or type a new value that's not in the list for a Scene DNA or Shot field, you can add it as a new reusable option. It will be saved locally in your browser."
  }
};

export const CUSTOM_OPTION_VALUE = "__custom__";

// --- Impact Lab Data ---
export const CREATIVE_CONCEPT_CATEGORIES: CreativeConceptCategory[] = [
  { id: 'curiosity_mystery', title: 'Curiosity & Mystery', description: "Shots designed to make the viewer ask 'what am I seeing?'" },
  { id: 'anxiety_tension', title: 'Anxiety & Tension', description: "Shots designed to make the viewer feel uneasy or threatened." },
  { id: 'awe_surrealism', title: 'Awe & Surrealism', description: "Shots that break the rules of reality to create a sense of wonder." },
  { id: 'focus_intimacy', title: 'Focus & Intimacy', description: "Shots that force extreme closeness or attention to a specific detail." },
  { id: 'satire_anachronism', title: 'Satire & Anachronism', description: "Shots that intentionally break historical accuracy for comedic or satirical effect." },
];

export const CREATIVE_CONCEPTS: CreativeConcept[] = [
  // Curiosity & Mystery
  {
    id: 'object_pov',
    title: 'Object-Embedded POV (منظور الجماد)',
    psychologicalEffect: 'Confusion and strangeness. "Why am I seeing the world from inside a skull?"',
    promptSnippet: 'POV shot from the perspective of an inanimate object, looking out from inside a hollow skull\'s eye socket.',
    category: 'curiosity_mystery',
  },
  {
    id: 'natural_framing',
    title: 'Natural Framing (الإطار الطبيعي)',
    psychologicalEffect: 'A sense of voyeurism or a hidden glimpse into a scene.',
    promptSnippet: 'Extreme natural framing, view is significantly obscured by foreground elements (e.g., leaves, a crack in a wall, between two closely packed items), creating a narrow window onto the main subject.',
    category: 'curiosity_mystery',
  },
  // Anxiety & Tension
  {
    id: 'claustrophobic_shot',
    title: 'Claustrophobic Shot (اللقطة الخانقة)',
    psychologicalEffect: 'Discomfort and a feeling of being trapped or overwhelmed.',
    promptSnippet: 'Extreme close-up, oppressively tight framing, subject fills the entire frame with very little to no negative space, invading personal space.',
    category: 'anxiety_tension',
  },
  {
    id: 'vertigo_swirl',
    title: 'Vertigo Swirl (دوّامة الدوار)',
    psychologicalEffect: 'Dizziness, disorientation, and a sense of unease or impending doom.',
    promptSnippet: 'Dutch angle combined with a swirling, distorted perspective, as if looking through a warped lens or experiencing a dizzy spell, background elements curve and spiral.',
    category: 'anxiety_tension',
  },
  // Awe & Surrealism
  {
    id: 'impossible_camera',
    title: 'Impossible Camera (كاميرا مستحيلة)',
    psychologicalEffect: 'Surprise and a delightful break from reality, making the viewer question the scene\'s logic.',
    promptSnippet: 'Impossible camera placement, shot from a physically unattainable viewpoint, such as from inside a solid object looking out, or a camera path that defies physics.',
    category: 'awe_surrealism',
  },
  {
    id: 'impossible_scale',
    title: 'Impossible Scale (تلاعب بالمقياس)',
    psychologicalEffect: 'Wonder, dreamlike quality, and a shift in perceived importance or power.',
    promptSnippet: 'Surreal juxtaposition of vastly different scales, e.g., a miniature person standing on a normal-sized book, or a giant teacup in a landscape. Subject\'s scale is unexpectedly and illogically altered relative to their environment.',
    category: 'awe_surrealism',
  },
  // Focus & Intimacy
  {
    id: 'tunnel_focus',
    title: 'Tunnel Focus (التركيز النَفَقي)',
    psychologicalEffect: 'Intense focus on a specific detail, creating a sense of heightened importance or obsession.',
    promptSnippet: 'Extreme tunnel vision effect, heavy vignetting with sharp focus only on a very small central detail, rest of the image is dark and blurred.',
    category: 'focus_intimacy',
  },
  {
    id: 'intimate_whisper',
    title: 'The Intimate Whisper (همس الكاميرا)',
    psychologicalEffect: 'Extreme closeness and a sense of shared secrets or private thoughts.',
    promptSnippet: 'Macro shot of a tiny detail on the subject (e.g., a single bead of sweat, the texture of fabric, a whisper from lips), camera is uncomfortably close, almost touching.',
    category: 'focus_intimacy',
  },
  // Satire & Anachronism
  {
    id: 'ancient_selfie',
    title: 'Ancient Selfie (سيلفي الأجداد)',
    psychologicalEffect: 'Humor, irony, and a playful comment on modern obsessions.',
    promptSnippet: 'Subject in historical attire taking a selfie with an anachronistic smartphone, posing with a typical selfie expression.',
    category: 'satire_anachronism',
  },
  {
    id: 'tourist_from_future',
    title: 'Tourist from the Future (سائح من المستقبل)',
    psychologicalEffect: 'Amusement, curiosity, and a gentle critique of tourism or cultural insensitivity.',
    promptSnippet: 'A person in modern tourist clothing (Hawaiian shirt, baseball cap, camera) incongruously observing or interacting with a historical scene, looking out of place.',
    category: 'satire_anachronism',
  },
  {
    id: 'plastic_waste',
    title: 'Plastic Waste (نفايات بلاستيكية)',
    psychologicalEffect: 'Sobering irony, ecological commentary, and a jarring anachronism.',
    promptSnippet: 'Anachronistic plastic waste (e.g., plastic bottles, shopping bags) visibly littered within an otherwise pristine historical setting.',
    category: 'satire_anachronism',
  },
  {
    id: 'graffiti_on_ruins',
    title: 'Graffiti on the Ruins (جرافيتي على الآثار)',
    psychologicalEffect: 'Critique of vandalism, cultural commentary, or a surprising blend of old and new art forms.',
    promptSnippet: 'Modern spray-paint graffiti anachronistically adorning ancient ruins or historical architecture.',
    category: 'satire_anachronism',
  },
];