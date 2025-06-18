import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
    Scene, Shot, SceneTemplate, Theme, Direction, FormField, 
    OptionMap, OptionSet, PromptDataValue, CustomOptionPayload, View, 
    ShotSpecificData, PromptData, CreativeConcept
} from '../types';
import { 
    DEFAULT_SCENE_TEMPLATES, SCENE_DNA_STRUCTURE, SHOT_SPECIFIC_STRUCTURE, 
    ASPECT_RATIO_OPTIONS, CREATIVE_CONCEPTS
} from '../constants';
import { serializeFullPrompt } from '../lib/promptUtils'; 
import { PROMPT_OPTIONS_DATA } from '../src/data/promptOptions';

interface AppState {
  scenes: Scene[];
  currentSceneId: string | null;
  currentView: View; 
  
  sceneTemplates: SceneTemplate[];
  theme: Theme;
  direction: Direction;
  isHelpModalOpen: boolean;
  helpModalContentKey: string | null;
  
  customOptions: OptionMap;
  isCustomOptionModalOpen: boolean;
  customOptionModalFieldId: keyof OptionMap | null;

  editingSceneDna: PromptData; 
  editingSceneTitle: string; 

  navigateTo: (view: View, sceneId?: string) => void;

  createNewScene: (templateId?: string) => void; 
  saveCurrentSceneSettings: () => void; 
  loadSceneForSettings: (sceneId: string) => void; 
  deleteScene: (sceneId: string) => void;
  duplicateScene: (sceneId: string) => void;

  addShotToCurrentScene: (shotDataWithName: ShotSpecificData & { name?: string }) => void;
  updateShotInCurrentScene: (shotId: string, shotData: ShotSpecificData, shotName?: string) => void;
  deleteShotFromCurrentScene: (shotId: string) => void;

  saveSceneAsTemplate: (name: string, sceneId: string) => void;
  deleteSceneTemplate: (id: string) => void;

  setTheme: (theme: Theme) => void;
  setDirection: (direction: Direction) => void;
  openHelpModal: (contentKey: string) => void;
  closeHelpModal: () => void;

  addCustomOption: (payload: CustomOptionPayload) => void;
  openCustomOptionModal: (fieldId: keyof OptionMap) => void;
  closeCustomOptionModal: () => void;
  getOptionsForField: (fieldId: keyof OptionMap, context?: { era?: string }) => OptionSet[];

  updateEditingSceneDnaField: (fieldId: string, value: PromptDataValue) => void;
  setEditingSceneTitle: (title: string) => void;
}

const generateInitialDataForStructure = (structure: FormField[]): PromptData => {
  const baseData = structure.reduce((acc, field) => {
    if (field.type === 'select' || field.optionsKey && field.type !== 'multiselect') {
      acc[field.id] = (field.defaultValue && typeof field.defaultValue === 'string') ? field.defaultValue : "";
    } else { // Handles text, textarea, and multiselect (which defaults to array)
      const dv = field.defaultValue;
      acc[field.id] = dv ? (Array.isArray(dv) ? dv : [dv]) : [];
    }
    return acc;
  }, {} as PromptData);
  
  if (!baseData.aspectRatio) {
    const aspectRatioField = SCENE_DNA_STRUCTURE.flatMap(g => g.fields).find(f => f.id === 'aspectRatio');
    baseData.aspectRatio = aspectRatioField?.defaultValue as string || ASPECT_RATIO_OPTIONS[0]?.value || "16:9";
  }
  if (!baseData.keyElements) { // Ensure keyElements is initialized
    baseData.keyElements = [];
  }
  return baseData;
};

const initialSceneDna = generateInitialDataForStructure(SCENE_DNA_STRUCTURE.flatMap(g => g.fields));


export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      scenes: [],
      currentSceneId: null,
      currentView: 'home',
      
      sceneTemplates: DEFAULT_SCENE_TEMPLATES.map(t => ({ // Ensure default templates also have keyElements
        ...t,
        sceneDna: {
          ...initialSceneDna, // Apply full defaults first
          ...t.sceneDna,       // Then template specifics
          keyElements: t.sceneDna.keyElements || [], // Ensure keyElements is array
        }
      })),
      theme: 'dark',
      direction: 'ltr',
      isHelpModalOpen: false,
      helpModalContentKey: null,
      customOptions: {},
      isCustomOptionModalOpen: false,
      customOptionModalFieldId: null,

      editingSceneDna: { ...initialSceneDna },
      editingSceneTitle: "New Scene",

      navigateTo: (view, sceneId) => {
        set({ currentView: view });
        if (view === 'sceneSettings') {
          if (sceneId) { 
            get().loadSceneForSettings(sceneId);
          } else { 
            set({ 
              currentSceneId: null, 
              editingSceneDna: { ...initialSceneDna, keyElements: [] }, // Ensure keyElements is fresh array for new scene
              editingSceneTitle: "New Scene" 
            });
          }
        } else if (view === 'storyboard' && sceneId) {
          set({ currentSceneId: sceneId });
        } else if (view === 'home') {
          set({ currentSceneId: null });
        }
      },

      loadSceneForSettings: (sceneId: string) => {
        const scene = get().scenes.find(s => s.id === sceneId);
        if (scene) {
          const sceneDnaWithFallback = { 
            ...initialSceneDna, 
            ...scene.dna,
            keyElements: scene.dna.keyElements || [], // Ensure keyElements is array
          };
          if (!sceneDnaWithFallback.aspectRatio) {
            sceneDnaWithFallback.aspectRatio = initialSceneDna.aspectRatio;
          }

          set({
            currentSceneId: sceneId, 
            editingSceneDna: sceneDnaWithFallback,
            editingSceneTitle: scene.title,
            currentView: 'sceneSettings'
          });
        }
      },
      
      createNewScene: (templateId?: string) => {
        let newSceneDna = { ...initialSceneDna, keyElements: [] }; // Fresh keyElements
        let newSceneTitle = "Untitled Scene";

        if (templateId) {
          const template = get().sceneTemplates.find(t => t.id === templateId);
          if (template) {
            newSceneDna = { ...initialSceneDna, ...template.sceneDna, keyElements: template.sceneDna.keyElements || [] };
            if (!newSceneDna.aspectRatio) {
                 newSceneDna.aspectRatio = template.sceneDna.aspectRatio || initialSceneDna.aspectRatio;
            }
            newSceneTitle = template.sceneTitle || "Scene from Template";
          }
        }
        
        set({
          currentSceneId: null, 
          editingSceneDna: newSceneDna,
          editingSceneTitle: newSceneTitle,
          currentView: 'sceneSettings'
        });
      },

      saveCurrentSceneSettings: () => {
        const { editingSceneDna, editingSceneTitle, currentSceneId, scenes } = get();
        if (!editingSceneTitle.trim()) {
          alert("Scene title cannot be empty.");
          return;
        }
        
        const finalEditingDna = { 
            ...editingSceneDna,
            keyElements: editingSceneDna.keyElements || [], // Ensure keyElements is array
        };
        if (!finalEditingDna.aspectRatio || finalEditingDna.aspectRatio === "") {
            finalEditingDna.aspectRatio = initialSceneDna.aspectRatio; 
        }


        if (currentSceneId) { 
          set({
            scenes: scenes.map(s => s.id === currentSceneId ? { ...s, title: editingSceneTitle, dna: { ...finalEditingDna } } : s),
            currentView: 'storyboard' 
          });
        } else { 
          const newSceneId = `scene-${Date.now()}`;
          const newScene: Scene = {
            id: newSceneId,
            title: editingSceneTitle,
            dna: { ...finalEditingDna },
            storyboard: [],
            timestamp: Date.now(),
          };
          set({
            scenes: [...scenes, newScene],
            currentSceneId: newSceneId,
            currentView: 'storyboard' 
          });
        }
      },
      
      deleteScene: (sceneId) => set(state => ({
        scenes: state.scenes.filter(s => s.id !== sceneId),
        currentSceneId: state.currentSceneId === sceneId ? null : state.currentSceneId,
        currentView: state.currentSceneId === sceneId ? 'home' : state.currentView,
      })),

      duplicateScene: (sceneId) => {
        const sceneToDuplicate = get().scenes.find(s => s.id === sceneId);
        if (sceneToDuplicate) {
          const newScene: Scene = {
            ...sceneToDuplicate,
            id: `scene-${Date.now()}`,
            title: `${sceneToDuplicate.title} (Copy)`,
            dna: { 
              ...initialSceneDna, 
              ...JSON.parse(JSON.stringify(sceneToDuplicate.dna)),
              keyElements: sceneToDuplicate.dna.keyElements ? [...sceneToDuplicate.dna.keyElements] : [], // Deep copy array
            },
            storyboard: JSON.parse(JSON.stringify(sceneToDuplicate.storyboard)).map((shot: Shot) => ({...shot, id: `shot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`})), 
            timestamp: Date.now(),
          };
          if (!newScene.dna.aspectRatio) {
            newScene.dna.aspectRatio = initialSceneDna.aspectRatio;
          }
          set(state => ({ scenes: [...state.scenes, newScene] }));
        }
      },

      addShotToCurrentScene: (shotDataWithName) => {
        const { currentSceneId, scenes } = get();
        if (!currentSceneId) return;

        const scene = scenes.find(s => s.id === currentSceneId);
        if (!scene) return;
        
        const sceneDnaForPrompt = { 
            ...initialSceneDna, 
            ...scene.dna,
            keyElements: scene.dna.keyElements || [],
        };
         if (!sceneDnaForPrompt.aspectRatio) {
            sceneDnaForPrompt.aspectRatio = initialSceneDna.aspectRatio;
        }

        const { name, ...pureShotData } = shotDataWithName; 

        const generatedPrompt = serializeFullPrompt(
            sceneDnaForPrompt, 
            pureShotData,  
            SCENE_DNA_STRUCTURE,
            SHOT_SPECIFIC_STRUCTURE,
            PROMPT_OPTIONS_DATA, 
            get().customOptions,
            CREATIVE_CONCEPTS 
        );

        const newShot: Shot = {
          id: `shot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sceneId: currentSceneId,
          shotSpecificData: pureShotData,
          name: name, 
          generatedPrompt,
          timestamp: Date.now(),
          previewImageUrl: `https://picsum.photos/seed/${Date.now()}-${Math.random()}/100/80`
        };
        set({
          scenes: scenes.map(s => s.id === currentSceneId ? { ...s, storyboard: [...s.storyboard, newShot] } : s)
        });
      },

      updateShotInCurrentScene: (shotId, shotData, shotName) => { 
         const { currentSceneId, scenes } = get();
        if (!currentSceneId) return;
        const scene = scenes.find(s => s.id === currentSceneId);
        if (!scene) return;

        const sceneDnaForPrompt = { 
            ...initialSceneDna, 
            ...scene.dna,
            keyElements: scene.dna.keyElements || [],
        };
         if (!sceneDnaForPrompt.aspectRatio) {
            sceneDnaForPrompt.aspectRatio = initialSceneDna.aspectRatio;
        }

        const generatedPrompt = serializeFullPrompt(
            sceneDnaForPrompt, 
            shotData,
            SCENE_DNA_STRUCTURE,
            SHOT_SPECIFIC_STRUCTURE,
            PROMPT_OPTIONS_DATA, 
            get().customOptions,
            CREATIVE_CONCEPTS 
        );

        set({
            scenes: scenes.map(s => s.id === currentSceneId ? {
                ...s,
                storyboard: s.storyboard.map(sh => sh.id === shotId ? {
                    ...sh, 
                    shotSpecificData: shotData, 
                    name: shotName !== undefined ? shotName : sh.name, 
                    generatedPrompt, 
                    timestamp: Date.now()
                } : sh)
            } : s)
        });
      },

      deleteShotFromCurrentScene: (shotId) => {
        const { currentSceneId, scenes } = get();
        if (!currentSceneId) return;
        set({
            scenes: scenes.map(s => s.id === currentSceneId ? {
                ...s,
                storyboard: s.storyboard.filter(sh => sh.id !== shotId)
            } : s)
        });
      },
      
      saveSceneAsTemplate: (name, sceneId) => {
        const scene = get().scenes.find(s => s.id === sceneId);
        if (scene) {
          const dnaForTemplate = { 
              ...initialSceneDna, 
              ...JSON.parse(JSON.stringify(scene.dna)),
              keyElements: scene.dna.keyElements ? [...scene.dna.keyElements] : [],
           };
          if (!dnaForTemplate.aspectRatio) {
            dnaForTemplate.aspectRatio = initialSceneDna.aspectRatio;
          }
          const newTemplate: SceneTemplate = {
            id: `template-user-${Date.now()}`,
            name,
            sceneTitle: scene.title,
            sceneDna: dnaForTemplate, 
            isUserDefined: true,
          };
          set(state => ({ sceneTemplates: [...state.sceneTemplates, newTemplate] }));
        }
      },
      deleteSceneTemplate: (id) => set(state => ({
        sceneTemplates: state.sceneTemplates.filter(t => t.id !== id && t.isUserDefined),
      })),
      
      setTheme: (theme) => set({ theme }),
      setDirection: (direction) => set({ direction }),
      openHelpModal: (contentKey) => set({ isHelpModalOpen: true, helpModalContentKey: contentKey }),
      closeHelpModal: () => set({ isHelpModalOpen: false, helpModalContentKey: null }),

      addCustomOption: (payload) => set(state => {
        const { fieldId, label, value, eraScope } = payload;
        const newOption: OptionSet = { label, value, eraScope, userScope: [] };
        
        const existingCustomOptionsForField = state.customOptions[fieldId] || [];
        if (existingCustomOptionsForField.find(opt => opt.value === value) || PROMPT_OPTIONS_DATA[fieldId]?.find(opt => opt.value === value)) {
            return state; 
        }
        const updatedCustomOptionsForField = [...existingCustomOptionsForField, newOption];
        const newCustomOptions = { ...state.customOptions, [fieldId]: updatedCustomOptionsForField };
        
        let newEditingSceneDna = state.editingSceneDna;
        // If adding a custom option for a field currently being edited (e.g. keyElements)
        // and it's a multiselect, we might want to add it to the selection.
        // For simplicity, current logic just updates the options list. User needs to re-select.
        if (state.currentView === 'sceneSettings' && state.editingSceneDna.hasOwnProperty(fieldId)) {
            const currentFieldValue = state.editingSceneDna[fieldId];
            if (Array.isArray(currentFieldValue) && fieldId === 'keyElements') { // For multiselect like keyElements
                // newEditingSceneDna = { ...state.editingSceneDna, [fieldId]: [...currentFieldValue, value] };
            } else if (typeof currentFieldValue === 'string') { // For single select
                 newEditingSceneDna = { ...state.editingSceneDna, [fieldId]: value };
            }
        }

        return { customOptions: newCustomOptions, editingSceneDna: newEditingSceneDna };
      }),
      openCustomOptionModal: (fieldId) => set({ isCustomOptionModalOpen: true, customOptionModalFieldId: fieldId }),
      closeCustomOptionModal: () => set({ isCustomOptionModalOpen: false, customOptionModalFieldId: null }),
      
      getOptionsForField: (fieldId: keyof OptionMap, context?: { era?: string }) => {
        const staticOptions = PROMPT_OPTIONS_DATA[fieldId] || [];
        const customOpts = get().customOptions[fieldId] || [];
        let combined = [...staticOptions, ...customOpts];
        
        const uniqueValues = new Set<string>();
        combined = combined.reverse().filter(opt => {
            if (uniqueValues.has(opt.value)) return false;
            uniqueValues.add(opt.value);
            return true;
        }).reverse();

        if (context?.era && context.era !== "") {
          combined = combined.filter(opt => !opt.eraScope || opt.eraScope.length === 0 || opt.eraScope.includes(context.era as string));
        }
        return combined;
      },

      updateEditingSceneDnaField: (fieldId, value) => set(state => ({
        editingSceneDna: { ...state.editingSceneDna, [fieldId]: value }
      })),
      setEditingSceneTitle: (title) => set({ editingSceneTitle: title }),

    }),
    {
      name: 'historical-prompt-builder-storage-v2', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        scenes: state.scenes, 
        sceneTemplates: state.sceneTemplates.filter(t => t.isUserDefined), 
        theme: state.theme,
        direction: state.direction,
        customOptions: state.customOptions,
      }),
    }
  )
);