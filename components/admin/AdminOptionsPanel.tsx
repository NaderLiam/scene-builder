
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { OptionMap, OptionSet, CustomOptionPayload } from '../../types';
import { PROMPT_OPTIONS_DATA } from '../../src/data/promptOptions'; // Static base options

const AdminOptionsPanel: React.FC<{onClose: () => void}> = ({ onClose }) => {
  const customOptions = useAppStore(state => state.customOptions);
  const addCustomOption = useAppStore(state => state.addCustomOption);
  const getOptionsForField = useAppStore(state => state.getOptionsForField);

  const [selectedField, setSelectedField] = useState<keyof OptionMap | ''>('');
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');

  // Fields that can have custom options are defined by the keys in PROMPT_OPTIONS_DATA
  // or more broadly, any keyof OptionMap.
  const allPossibleOptionMapKeys = Object.keys(PROMPT_OPTIONS_DATA) as (keyof OptionMap)[];
  // One could also derive this from all `optionsKey` present in SCENE_DNA_STRUCTURE and SHOT_SPECIFIC_STRUCTURE,
  // but using OptionMap keys directly is simpler if OptionMap is the definitive source for selectable fields.


  const handleAddOption = () => {
    if (!selectedField || !newOptionLabel.trim() || !newOptionValue.trim()) {
      alert("Please select a field and provide both label and value for the new option.");
      return;
    }
    const payload: CustomOptionPayload = {
      fieldId: selectedField, // This is keyof OptionMap
      label: newOptionLabel.trim(),
      value: newOptionValue.trim().toLowerCase().replace(/\s+/g, '_'), // Sanitize value
    };
    addCustomOption(payload);
    setNewOptionLabel('');
    setNewOptionValue('');
    alert(`Option "${payload.label}" added to "${selectedField}".`);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative max-w-2xl mx-auto bg-[var(--bg-card)] text-[var(--fg-primary)] p-6 rounded-lg shadow-xl mt-10">
        <button onClick={onClose} className="absolute top-3 end-3 text-[var(--fg-muted)] hover:text-[var(--fg-primary)] text-2xl" aria-label="Close admin panel">&times;</button>
        <h2 className="text-xl font-bold text-[var(--accent)] mb-6">Admin: Manage Prompt Options</h2>

        <div className="mb-6 p-4 border border-[var(--bg-input)] rounded-md">
          <h3 className="text-lg font-semibold text-[var(--fg-muted)] mb-3">Add New Custom Option</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="fieldSelectAdmin" className="block text-sm font-medium mb-1">Field:</label>
              <select
                id="fieldSelectAdmin"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value as keyof OptionMap | '')}
                className="w-full p-2 bg-[var(--bg-input)] rounded-md"
              >
                <option value="">Select Field Key</option>
                {allPossibleOptionMapKeys.map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="newOptionLabelAdmin" className="block text-sm font-medium mb-1">New Option Label:</label>
              <input
                type="text"
                id="newOptionLabelAdmin"
                value={newOptionLabel}
                onChange={(e) => setNewOptionLabel(e.target.value)}
                className="w-full p-2 bg-[var(--bg-input)] rounded-md"
                placeholder="Visible text"
              />
            </div>
            <div>
              <label htmlFor="newOptionValueAdmin" className="block text-sm font-medium mb-1">New Option Value:</label>
              <input
                type="text"
                id="newOptionValueAdmin"
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
                className="w-full p-2 bg-[var(--bg-input)] rounded-md"
                placeholder="internal_value"
              />
            </div>
          </div>
          <button
            onClick={handleAddOption}
            className="mt-4 px-4 py-2 text-sm font-medium rounded-md bg-[var(--accent)] text-[var(--bg-surface-dark)] hover:bg-[var(--accent-hover)]"
          >
            Add Option
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[var(--fg-muted)] mb-3">Current Options (Static + Custom)</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-[var(--bg-input)]">
            {allPossibleOptionMapKeys.map(fieldKey => {
              const options = getOptionsForField(fieldKey); // This now gets combined options
              return (
                <div key={fieldKey}>
                  <h4 className="font-semibold text-[var(--accent-dark)] capitalize">{fieldKey}</h4>
                  {options.length > 0 ? (
                    <ul className="list-disc ps-5 text-xs">
                      {options.map(opt => (
                        <li key={opt.value} className="mb-0.5">
                          {opt.label} ({opt.value})
                          {PROMPT_OPTIONS_DATA[fieldKey]?.find(o => o.value === opt.value) ? 
                           <span className="text-green-400 ms-2 text-[0.6rem]">(Static)</span> : 
                           <span className="text-yellow-400 ms-2 text-[0.6rem]">(Custom)</span>
                          }
                           {opt.eraScope && opt.eraScope.length > 0 && <span className="text-blue-400 ms-2 text-[0.6rem]">Era: {opt.eraScope.join(', ')}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[var(--fg-muted)]">No options defined for '{fieldKey}'.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <button
            onClick={onClose}
            className="mt-6 px-4 py-2 text-sm font-medium rounded-md bg-[var(--bg-input)] text-[var(--fg-muted)] hover:bg-opacity-80 transition-colors"
          >
            Close Admin Panel
          </button>
      </div>
    </div>
  );
};

export default AdminOptionsPanel;
