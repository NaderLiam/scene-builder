import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Scene, Shot, ShotSpecificData, OptionMap, FormField, PromptDataValue } from '../types';
import ShotCard from './ShotCard';
import FormFieldGroup from './prompt-builder/FormFieldGroup';
import ImpactLab from './prompt-builder/ImpactLab'; 
// ScriptAnalysisModal related imports are removed
import { PlusCircleIcon, EditIcon, SaveIcon, XCircleIcon, ChevronDownIcon, ChevronRightIcon } from './icons/LucideIcons'; 
import { PROMPT_OPTIONS_DATA } from '../src/data/promptOptions';
import { SHOT_SPECIFIC_STRUCTURE, CREATIVE_CONCEPT_CATEGORIES, CREATIVE_CONCEPTS } from '../constants';
import { generateInitialShotData } from '../lib/shotUtils';

// ScriptAnalysisModal lazy import is removed

interface StoryboardPageProps {
  sceneId: string;
}

const StoryboardPage: React.FC<StoryboardPageProps> = ({ sceneId }) => {
  const scene = useAppStore(state => state.scenes.find(s => s.id === sceneId));
  const navigateTo = useAppStore(state => state.navigateTo);
  const openHelpModal = useAppStore(state => state.openHelpModal);
  const addShotToCurrentScene = useAppStore(state => state.addShotToCurrentScene);
  const updateShotInCurrentScene = useAppStore(state => state.updateShotInCurrentScene);
  const direction = useAppStore(state => state.direction);

  const [currentShotFormData, setCurrentShotFormData] = useState<ShotSpecificData>(generateInitialShotData());
  const [currentShotName, setCurrentShotName] = useState('');
  const [editingShotId, setEditingShotId] = useState<string | null>(null);

  const [isImpactLabExpanded, setIsImpactLabExpanded] = useState(false);
  const [expandedImpactCategory, setExpandedImpactCategory] = useState<string | null>(null);

  // isScriptAnalysisModalOpen state is removed

  useEffect(() => {
    handleFormClear(); 
  }, [sceneId]);

  if (!scene) {
    return (
      <div className="text-center p-8">
        <p className="text-xl text-[var(--fg-muted)]">Scene not found.</p>
        <button onClick={() => navigateTo('home')} className="mt-4 px-4 py-2 text-sm rounded-md bg-[var(--accent)] text-[var(--bg-surface-dark)]">
          Go to Home
        </button>
      </div>
    );
  }

  const getLabelForValue = (optionKey: keyof OptionMap, value: string): string => {
    const options = PROMPT_OPTIONS_DATA[optionKey] || [];
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const coreDnaDisplay = [
    { label: "Era", value: scene.dna.era ? getLabelForValue("era", scene.dna.era as string) : "N/A" },
    { label: "Location", value: scene.dna.location ? getLabelForValue("location", scene.dna.location as string) : "N/A" },
    { label: "Mood", value: scene.dna.mood ? getLabelForValue("mood", scene.dna.mood as string) : "N/A" },
    { label: "Lighting", value: scene.dna.lighting ? getLabelForValue("lighting", scene.dna.lighting as string) : "N/A" },
  ].filter(item => item.value && item.value !== "N/A");

  const handleEditShot = (shot: Shot) => {
    setEditingShotId(shot.id);
    setCurrentShotFormData({ 
        ...generateInitialShotData(), 
        ...shot.shotSpecificData 
    });
    setCurrentShotName(shot.name || '');
    setIsImpactLabExpanded(!!shot.shotSpecificData.selectedCreativeConceptId); 
    setExpandedImpactCategory(null); 

    const formPanel = document.getElementById('shot-form-panel');
    formPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const firstInput = formPanel?.querySelector('input, textarea, select') as HTMLElement;
    firstInput?.focus();
  };

  const handleFormClear = () => {
    setEditingShotId(null);
    setCurrentShotFormData(generateInitialShotData());
    setCurrentShotName('');
    setIsImpactLabExpanded(false);
    setExpandedImpactCategory(null);
  };

  const handleShotFieldUpdate = (fieldId: string, value: PromptDataValue | string | undefined) => { 
    setCurrentShotFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmitShot = (e: React.FormEvent) => {
    e.preventDefault();
    const finalShotData: ShotSpecificData = { ...currentShotFormData };

    if (editingShotId) {
      updateShotInCurrentScene(editingShotId, finalShotData, currentShotName.trim() || undefined);
    } else {
      addShotToCurrentScene({ ...finalShotData, name: currentShotName.trim() || undefined });
    }
    handleFormClear(); 
  };

  const getOptionMapKeyForShotField = (fieldId: string): keyof OptionMap | undefined => {
    for (const group of SHOT_SPECIFIC_STRUCTURE) {
      const field = group.fields.find(f => f.id === fieldId);
      if (field && field.optionsKey) {
        return field.optionsKey;
      }
    }
    return undefined;
  };
  
  const currentEraValueForShotOptions = typeof scene.dna.era === 'string' ? scene.dna.era : undefined;

  const ChevronIcon = isImpactLabExpanded ? ChevronDownIcon : (direction === 'rtl' ? ChevronRightIcon : ChevronRightIcon );


  return (
    <div className="flex flex-col lg:flex-row gap-6 p-1 md:p-4 h-[calc(100vh-var(--header-height,68px)-2rem)]">
      <div className="lg:w-3/5 xl:w-2/3 flex flex-col space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--bg-input)] scrollbar-track-transparent pr-2">
        <div className="p-4 bg-[var(--bg-card)] rounded-lg shadow-lg sticky top-0 z-10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <button onClick={() => navigateTo('home')} className="text-xs text-[var(--accent)] hover:underline mb-1 block">&larr; Back to Scenes</button>
              <h2 className="text-2xl font-bold gradient-text truncate" title={scene.title}>{scene.title}</h2>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                {/* Analyze Script button removed */}
                <button
                onClick={() => navigateTo('sceneSettings', scene.id)}
                title="Edit Scene DNA"
                className="p-1.5 text-sm rounded-md text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors flex-shrink-0 flex items-center border border-[var(--bg-input)] hover:border-[var(--accent)]"
                >
                <EditIcon className="w-4 h-4 me-1"/> Edit DNA
                </button>
            </div>
          </div>
          {coreDnaDisplay.length > 0 && (
            <div className="mt-2 text-xs text-[var(--fg-muted)] flex flex-wrap gap-x-3 gap-y-1">
              {coreDnaDisplay.map(item => (
                <span key={item.label} className="border border-[var(--bg-input)] px-1.5 py-0.5 rounded-full">
                  <strong>{item.label}:</strong> {item.value}
                </span>
              ))}
              <button 
                onClick={() => openHelpModal('sceneDNA')}
                className="text-[var(--fg-muted)] hover:text-[var(--accent)] text-xs"
                title="About Scene DNA"
              >
                (What's this?)
              </button>
            </div>
          )}
        </div>

        {scene.storyboard.length === 0 ? (
          <p className="text-center text-lg text-[var(--fg-muted)] py-10 bg-[var(--bg-card)] rounded-lg shadow mt-4">
            Storyboard is empty. Add your first shot using the panel on the right!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-4"> 
            {scene.storyboard.slice().sort((a,b) => a.timestamp - b.timestamp).map(shot => (
              <ShotCard key={shot.id} shot={shot} onEdit={() => handleEditShot(shot)} />
            ))}
          </div>
        )}
      </div>

      <div id="shot-form-panel" className="lg:w-2/5 xl:w-1/3 p-4 bg-[var(--bg-card)] rounded-lg shadow-xl overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--bg-input)] scrollbar-track-transparent flex flex-col">
        <h3 className="text-xl font-semibold text-[var(--accent)] mb-4 sticky top-0 bg-[var(--bg-card)] py-2 z-10">
          {editingShotId ? `Edit Shot (ID: ${editingShotId.slice(-4)})` : "Add New Shot Manually"}
        </h3>
        <form onSubmit={handleSubmitShot} className="space-y-3 flex-grow flex flex-col">
          <div className="mb-4">
            <label htmlFor="shotName" className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
              Shot Name / Label (Optional):
            </label>
            <input
              type="text"
              id="shotName"
              value={currentShotName}
              onChange={(e) => setCurrentShotName(e.target.value)}
              placeholder="e.g., Close-up on merchant's hands"
              className="w-full p-2 bg-[var(--bg-input)] text-[var(--fg-primary)] rounded-md focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex-grow overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-[var(--bg-input)]">
            {SHOT_SPECIFIC_STRUCTURE.map(group => (
              <FormFieldGroup
                key={group.id}
                group={group}
                data={currentShotFormData as any} 
                onUpdateField={handleShotFieldUpdate}
                currentEraValue={currentEraValueForShotOptions}
                getOptionMapKey={getOptionMapKeyForShotField}
              />
            ))}
            
            <div className="border border-[var(--bg-input)] rounded-md mt-4">
                <button
                    type="button"
                    onClick={() => setIsImpactLabExpanded(!isImpactLabExpanded)}
                    className="flex items-center justify-between w-full p-3 font-medium text-left text-[var(--fg-primary)] hover:bg-[var(--bg-input)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    aria-expanded={isImpactLabExpanded}
                >
                    <span className="truncate text-sm">
                        🧪 The Impact Lab 
                        {currentShotFormData.selectedCreativeConceptId ? 
                            <span className="text-[var(--accent-dark)]"> (1 selection active)</span> : 
                            <span className="text-[var(--fg-muted)]"> (Optional Creative Touches)</span>
                        }
                    </span>
                    <ChevronIcon className={`w-5 h-5 transform transition-transform ${isImpactLabExpanded ? (direction === 'rtl' ? 'rotate-180': '') : (direction === 'rtl' ? '-rotate-90' : '') } flex-shrink-0`} />
                </button>
                {isImpactLabExpanded && (
                    <div className="p-3 bg-[var(--bg-surface)] border-t border-[var(--bg-input)]">
                        {!currentShotFormData.selectedCreativeConceptId && (
                             <p className="text-xs text-[var(--fg-muted)] mb-3">Click to add advanced psychological hooks or satirical twists to your shot.</p>
                        )}
                        <ImpactLab
                            selectedConceptId={currentShotFormData.selectedCreativeConceptId}
                            onSelectConcept={(conceptId) => handleShotFieldUpdate('selectedCreativeConceptId', conceptId)}
                            onClearSelection={() => handleShotFieldUpdate('selectedCreativeConceptId', undefined)}
                            categories={CREATIVE_CONCEPT_CATEGORIES}
                            concepts={CREATIVE_CONCEPTS}
                            expandedCategory={expandedImpactCategory}
                            onToggleCategory={(catId) => setExpandedImpactCategory(prev => prev === catId ? null : catId)}
                            direction={direction}
                        />
                    </div>
                )}
            </div>

          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[var(--bg-input)] sticky bottom-0 bg-[var(--bg-card)] py-3">
            <button
              type="button"
              onClick={handleFormClear}
              disabled={!editingShotId && !currentShotName && Object.values(currentShotFormData).every(val => (Array.isArray(val) && val.length === 0) || val === "" || val === undefined || (typeof val === 'object' && val !== null && Object.keys(val).length === 0) )}
              className="px-4 py-2 text-sm font-medium rounded-md text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircleIcon className="w-4 h-4 me-1" />
              {editingShotId ? "Cancel Edit" : "Clear Form"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--accent)] text-[var(--bg-surface-dark)] hover:bg-[var(--accent-hover)] transition-colors flex items-center"
            >
              <SaveIcon className="w-4 h-4 me-2" />
              {editingShotId ? "Update Shot" : "Generate & Add to Storyboard"}
            </button>
          </div>
        </form>
      </div>
      {/* ScriptAnalysisModal Suspense block and component usage removed */}
    </div>
  );
};

export default StoryboardPage;