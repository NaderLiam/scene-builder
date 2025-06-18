
import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { OptionMap, CustomOptionPayload, Scene } from '../types';
import Modal from './Modal'; // Generic modal wrapper
import { SCENE_DNA_STRUCTURE, SHOT_SPECIFIC_STRUCTURE } from '../constants'; // Use new structures, removed PROMPT_FORM_STRUCTURE
import { PROMPT_OPTIONS_DATA } from '../src/data/promptOptions';

const CustomOptionModal: React.FC = () => {
  const isOpen = useAppStore(state => state.isCustomOptionModalOpen);
  const fieldId = useAppStore(state => state.customOptionModalFieldId); // This is keyof OptionMap
  const closeModal = useAppStore(state => state.closeCustomOptionModal);
  const addCustomOption = useAppStore(state => state.addCustomOption);
  
  const currentView = useAppStore(state => state.currentView);
  const editingSceneDnaEra = useAppStore(state => typeof state.editingSceneDna.era === 'string' ? state.editingSceneDna.era : undefined);
  const currentSceneId = useAppStore(state => state.currentSceneId);
  const currentScene = useAppStore(state => state.scenes.find(s => s.id === currentSceneId));


  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [makeEraSpecific, setMakeEraSpecific] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLabel('');
      setValue('');
      setMakeEraSpecific(false);
    }
  }, [isOpen]);

  if (!isOpen || !fieldId) return null;

  // Determine current era based on context
  let activeEra: string | undefined = undefined;
  if (currentView === 'sceneSettings') {
    activeEra = editingSceneDnaEra;
  } else if (currentView === 'storyboard' && currentScene) {
    activeEra = typeof currentScene.dna.era === 'string' ? currentScene.dna.era : undefined;
  }


  const getFieldLabelFromAnyStructure = (fId: keyof OptionMap): string => {
    const allStructures = [...SCENE_DNA_STRUCTURE, ...SHOT_SPECIFIC_STRUCTURE];
    for (const group of allStructures) {
      // field.id might not be the same as OptionMap key, we need to check field.optionsKey
      const field = group.fields.find(f => f.optionsKey === fId);
      if (field) return field.label;
    }
    return fId; // Fallback to the key itself
  };
  
  const modalTitle = `Add Custom Option for "${getFieldLabelFromAnyStructure(fieldId)}"`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !value.trim()) {
      alert("Both label and value are required.");
      return;
    }
    const payload: CustomOptionPayload = {
      fieldId, // This is already keyof OptionMap
      label: label.trim(),
      value: value.trim().toLowerCase().replace(/\s+/g, '_'),
      eraScope: makeEraSpecific && activeEra && activeEra !== "" ? [activeEra] : undefined,
    };
    addCustomOption(payload);
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customOptionLabel" className="block text-sm font-medium text-[var(--fg-muted)]">
            Display Label:
          </label>
          <input
            type="text"
            id="customOptionLabel"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-1 block w-full p-2 bg-[var(--bg-input)] text-[var(--fg-primary)] rounded-md border border-transparent focus:ring-1 focus:ring-[var(--accent)]"
            required
          />
          <p className="text-xs text-[var(--fg-muted)] mt-1">What users will see in the dropdown.</p>
        </div>
        <div>
          <label htmlFor="customOptionValue" className="block text-sm font-medium text-[var(--fg-muted)]">
            Value (for prompt):
          </label>
          <input
            type="text"
            id="customOptionValue"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1 block w-full p-2 bg-[var(--bg-input)] text-[var(--fg-primary)] rounded-md border border-transparent focus:ring-1 focus:ring-[var(--accent)]"
            required
          />
          <p className="text-xs text-[var(--fg-muted)] mt-1">Internal value, will be auto-formatted (e.g., "My Value" -&gt; "my_value").</p>
        </div>
        
        {fieldId !== 'era' && activeEra && activeEra !== "" && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="makeEraSpecific"
              checked={makeEraSpecific}
              onChange={(e) => setMakeEraSpecific(e.target.checked)}
              className="h-4 w-4 text-[var(--accent)] bg-[var(--bg-input)] border-[var(--fg-muted)] rounded focus:ring-[var(--accent)]"
            />
            <label htmlFor="makeEraSpecific" className="ms-2 block text-sm text-[var(--fg-muted)]">
              Make this option specific to the current era ({PROMPT_OPTIONS_DATA.era?.find(o => o.value === activeEra)?.label || activeEra})?
            </label>
          </div>
        )}

        <div className="flex justify-end space-x-2 rtl:space-x-reverse">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--bg-input)] text-[var(--fg-muted)] hover:bg-opacity-80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--accent)] text-[var(--bg-surface-dark)] hover:bg-[var(--accent-hover)] transition-colors"
          >
            Add Option
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomOptionModal;