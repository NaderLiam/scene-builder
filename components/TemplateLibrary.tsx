
import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { SceneTemplate } from '../types';
import { PlusCircleIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from './icons/LucideIcons';

interface AccordionItemProps {
  template: SceneTemplate;
  onApply: (id: string) => void; // createNewScene takes templateId
  onDelete?: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  direction: 'ltr' | 'rtl';
}

const AccordionItem: React.FC<AccordionItemProps> = ({ template, onApply, onDelete, isOpen, onToggle, direction }) => {
  const ChevronIcon = isOpen ? ChevronDownIcon : (direction === 'rtl' ? ChevronDownIcon : ChevronRightIcon);

  return (
    <div className="border-b border-[var(--bg-input)]">
      <h2>
        <button
          type="button"
          className="flex items-center justify-between w-full p-3 font-medium text-left text-[var(--fg-primary)] hover:bg-[var(--bg-input)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <span className="truncate" title={template.name}>{template.name}</span>
          <ChevronIcon className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-0' : (direction === 'rtl' ? '-rotate-90' : 'rotate-0') } flex-shrink-0`} />
        </button>
      </h2>
      {isOpen && (
        <div className="p-3 bg-[var(--bg-surface)]">
          <p className="text-xs text-[var(--fg-muted)] mb-1">Default Title: {template.sceneTitle}</p>
          <p className="text-xs text-[var(--fg-muted)] mb-2 truncate">
            Core DNA: {Object.keys(template.sceneDna).filter(k => {
                const val = template.sceneDna[k];
                return Array.isArray(val) ? val.length > 0 : !!val;
            }).join(', ')}
          </p>
          <div className="flex space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => onApply(template.id)}
              className="px-3 py-1 text-xs font-medium rounded-md bg-[var(--accent)] text-[var(--bg-surface-dark)] hover:bg-[var(--accent-hover)] transition-colors"
            >
              Use Template
            </button>
            {template.isUserDefined && onDelete && (
              <button
                onClick={() => onDelete(template.id)}
                className="px-3 py-1 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                <TrashIcon className="w-3 h-3 inline me-1" /> Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


const SceneTemplateLibrary: React.FC = () => {
  const sceneTemplates = useAppStore(state => state.sceneTemplates);
  const currentSceneId = useAppStore(state => state.currentSceneId); // To save current scene as template
  const saveSceneAsTemplate = useAppStore(state => state.saveSceneAsTemplate);
  const deleteSceneTemplate = useAppStore(state => state.deleteSceneTemplate);
  const createNewSceneFromTemplate = useAppStore(state => state.createNewScene); // This handles applying
  const direction = useAppStore(state => state.direction);
  
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  const handleToggleAccordion = (id: string) => {
    setOpenAccordionId(openAccordionId === id ? null : id);
  };

  const handleSaveCurrentSceneAsTemplate = () => {
    if (!currentSceneId) {
      alert("Please save or open a scene first to use it as a template.");
      // Or, could allow saving editingSceneDna if no currentSceneId but user is in sceneSettings
      return;
    }
    const name = window.prompt("Enter a name for this new scene template:", "My Custom Scene Template");
    if (name && currentSceneId) {
      saveSceneAsTemplate(name, currentSceneId);
    }
  };
  
  const builtInTemplates = sceneTemplates.filter(t => !t.isUserDefined);
  const userTemplates = sceneTemplates.filter(t => t.isUserDefined);

  return (
    <div className="p-4 bg-[var(--bg-card)] rounded-lg shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-[var(--accent)]">Scene Template Library</h3>
        <button
          onClick={handleSaveCurrentSceneAsTemplate}
          disabled={!currentSceneId} // Disable if no current scene is active to save
          title={!currentSceneId ? "Open or save a scene first" : "Save active scene's DNA as a new template"}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--accent)] text-[var(--bg-surface-dark)] hover:bg-[var(--accent-hover)] transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusCircleIcon className="w-4 h-4 me-1" /> Save Active Scene as Template
        </button>
      </div>
      
      {builtInTemplates.length > 0 && <h4 className="text-sm font-semibold text-[var(--fg-muted)] my-2 px-1">Built-in Templates</h4>}
      {builtInTemplates.length > 0 && (
        <div className="border border-[var(--bg-input)] rounded-md overflow-hidden max-h-60 scrollbar-thin scrollbar-thumb-[var(--bg-input)] overflow-y-auto">
          {builtInTemplates.map(template => (
            <AccordionItem 
              key={template.id} 
              template={template} 
              onApply={createNewSceneFromTemplate} 
              isOpen={openAccordionId === template.id}
              onToggle={() => handleToggleAccordion(template.id)}
              direction={direction}
            />
          ))}
        </div>
      )}

      {userTemplates.length > 0 && <h4 className="text-sm font-semibold text-[var(--fg-muted)] my-2 mt-4 px-1">My Templates</h4>}
      {userTemplates.length > 0 && (
        <div className="border border-[var(--bg-input)] rounded-md overflow-hidden max-h-60 scrollbar-thin scrollbar-thumb-[var(--bg-input)] overflow-y-auto">
          {userTemplates.map(template => (
            <AccordionItem 
              key={template.id} 
              template={template} 
              onApply={createNewSceneFromTemplate} 
              onDelete={deleteSceneTemplate}
              isOpen={openAccordionId === template.id}
              onToggle={() => handleToggleAccordion(template.id)}
              direction={direction}
            />
          ))}
        </div>
      )}
      {sceneTemplates.length === 0 && <p className="text-sm text-[var(--fg-muted)] text-center py-4">No scene templates available.</p>}
    </div>
  );
};

export default SceneTemplateLibrary;
