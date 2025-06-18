import React, { ChangeEvent, useState } from 'react';
import { OptionSet, OptionMap } from '../../types';
import { useFilteredOptions } from '../../hooks/useFilteredOptions';
import { XIcon } from '../icons/LucideIcons';

interface MultiSelectInputProps {
  id: keyof OptionMap; // Maps to FormField.id and OptionMap key
  label: string;
  selectedValues: string[]; // Array of selected option values (the descriptions themselves)
  onChange: (newValues: string[]) => void;
  optionsKey: keyof OptionMap;
  placeholder?: string;
  currentEraValue?: string; // For contextual filtering
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  id,
  label,
  selectedValues,
  onChange,
  optionsKey,
  placeholder,
  currentEraValue,
}) => {
  const [currentSelection, setCurrentSelection] = useState<string>(""); // Stores the value of the currently selected item in dropdown before adding
  const allAvailableOptions = useFilteredOptions(optionsKey, { era: currentEraValue });

  // Filter out options that are already selected or are the placeholder value ""
  const dropdownOptions = allAvailableOptions.filter(
    option => option.value !== "" && !selectedValues.includes(option.value)
  );

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const valueToAdd = e.target.value;
    if (valueToAdd && !selectedValues.includes(valueToAdd)) {
      onChange([...selectedValues, valueToAdd]);
    }
    setCurrentSelection(""); // Reset dropdown to placeholder after selection
    e.target.value = ""; // Forcefully reset the select element's displayed value
  };

  const removeSelectedValue = (valueToRemove: string) => {
    onChange(selectedValues.filter(value => value !== valueToRemove));
  };

  const getOptionLabelByValue = (value: string): string => {
    const foundOption = allAvailableOptions.find(opt => opt.value === value);
    return foundOption ? foundOption.label : value; // Fallback to value if label somehow not found
  }

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
        {label}
      </label>
      <select
        id={id}
        value={currentSelection} // Control the select with a temporary state
        onChange={handleSelectChange}
        className="w-full p-2 bg-[var(--bg-input)] text-[var(--fg-primary)] border border-transparent rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
      >
        <option value="">{placeholder || "Select an option..."}</option>
        {dropdownOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {dropdownOptions.length === 0 && selectedValues.length > 0 && (
            <option value="" disabled>All available elements for this era selected.</option>
        )}
         {dropdownOptions.length === 0 && selectedValues.length === 0 && (
            <option value="" disabled>No elements available for this era.</option>
        )}
      </select>

      {selectedValues.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedValues.map(value => (
            <span
              key={value}
              className="flex items-center bg-[var(--accent)] text-[var(--bg-surface-dark)] text-xs font-semibold px-2 py-1 rounded-full"
              title={value} // Show full description on hover
            >
              <span className="truncate max-w-xs">{getOptionLabelByValue(value)}</span>
              <button
                onClick={() => removeSelectedValue(value)}
                className="ms-2 text-[var(--bg-surface-dark)] hover:text-red-300 transition-colors flex-shrink-0"
                aria-label={`Remove ${getOptionLabelByValue(value)}`}
              >
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectInput;