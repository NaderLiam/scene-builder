
import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { SCENE_DNA_STRUCTURE } from '../constants';
import FormFieldGroup from './prompt-builder/FormFieldGroup'; // Reusing this
import { SaveIcon } from './icons/LucideIcons';
import { OptionMap } from '../types';

const SceneSettingsPage: React.FC = () => {
  const editingSceneTitle = useAppStore(state => state.editingSceneTitle);
  const setEditingSceneTitle = useAppStore(state => state.setEditingSceneTitle);
  const editingSceneDna = useAppStore(state => state.editingSceneDna);
  const updateEditingSceneDnaField = useAppStore(state => state.updateEditingSceneDnaField);
  const saveCurrentSceneSettings = useAppStore(state => state.saveCurrentSceneSettings);
  const navigateTo = useAppStore(state => state.navigateTo);
  const currentSceneId = useAppStore(state => state.currentSceneId); // To know if editing or creating

  // Helper to determine the OptionMap key for a field, as FormField.id is just a string
  const getOptionMapKeyForField = (fieldId: string): keyof OptionMap | undefined => {
    for (const group of SCENE_DNA_STRUCTURE) {
        const field = group.fields.find(f => f.id === fieldId);
        if (field && field.optionsKey) {
            return field.optionsKey;
        }
    }
    return undefined;
  };
  
  // Get current 'era' value from editingSceneDna for contextual filtering
  const currentEraValue = typeof editingSceneDna.era === 'string' ? editingSceneDna.era : undefined;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--fg-primary)]">
          {currentSceneId ? "Edit Scene DNA" : "Create New Scene"}
        </h2>
        <button
          onClick={() => navigateTo('home')}
          className="text-sm text-[var(--accent)] hover:underline"
        >
          &larr; Back to Home
        </button>
      </div>

      <div className="bg-[var(--bg-card)] p-6 rounded-lg shadow-xl mb-6">
        <label htmlFor="sceneTitle" className="block text-lg font-semibold text-[var(--accent)] mb-2">
          Scene Title
        </label>
        <input
          type="text"
          id="sceneTitle"
          value={editingSceneTitle}
          onChange={(e) => setEditingSceneTitle(e.target.value)}
          placeholder="e.g., The Grand Market of Alexandria"
          className="w-full p-3 bg-[var(--bg-input)] text-[var(--fg-primary)] rounded-md focus:ring-2 focus:ring-[var(--accent)] text-lg"
        />
      </div>

      {SCENE_DNA_STRUCTURE.map(group => (
          <FormFieldGroup
            key={group.id}
            group={group}
            data={editingSceneDna}
            onUpdateField={updateEditingSceneDnaField}
            currentEraValue={currentEraValue}
            getOptionMapKey={getOptionMapKeyForField}
          />
      ))}

      <div className="mt-8 flex justify-end">
        <button
          onClick={saveCurrentSceneSettings}
          className="px-6 py-3 text-lg font-semibold rounded-lg bg-[var(--accent)] text-[var(--bg-surface-dark)] hover:bg-[var(--accent-hover)] transition-colors flex items-center"
        >
          <SaveIcon className="w-5 h-5 me-2" />
          {currentSceneId ? "Save Scene & View Storyboard" : "Create Scene & Start Storyboard"}
        </button>
      </div>
    </div>
  );
};

export default SceneSettingsPage;
