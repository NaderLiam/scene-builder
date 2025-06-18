
import React, { ChangeEvent } from 'react';
import { OptionSet, OptionMap, PromptDataValue } from '../../types';
import { useFilteredOptions } from '../../hooks/useFilteredOptions';
import { useAppStore } from '../../store/useAppStore';
import { CUSTOM_OPTION_VALUE } from '../../constants';

interface SelectInputProps {
  id: keyof OptionMap; // Maps to FormField.id and OptionMap key
  label: string;
  value: PromptDataValue; // Should be a string for select
  onChange: (newValue: string) => void;
  optionsKey: keyof OptionMap;
  placeholder?: string;
  allowCustom?: boolean;
  currentEraValue?: string; // For contextual filtering
}

const SelectInput: React.FC<SelectInputProps> = ({
  id,
  label,
  value,
  onChange,
  optionsKey,
  placeholder,
  allowCustom,
  currentEraValue,
}) => {
  const openCustomOptionModal = useAppStore(state => state.openCustomOptionModal);
  const filteredOptions = useFilteredOptions(optionsKey, { era: currentEraValue });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue === CUSTOM_OPTION_VALUE) {
      openCustomOptionModal(id);
    } else {
      onChange(selectedValue);
    }
  };

  // Ensure value is a string, default to empty string if not or if it's an array (should not happen for select)
  const currentValue = typeof value === 'string' ? value : "";

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
        {label}
      </label>
      <select
        id={id}
        value={currentValue}
        onChange={handleChange}
        className="w-full p-2 bg-[var(--bg-input)] text-[var(--fg-primary)] border border-transparent rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {filteredOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        {allowCustom && (
          <option value={CUSTOM_OPTION_VALUE} className="italic text-[var(--accent)]">
            + Add Custom...
          </option>
        )}
      </select>
    </div>
  );
};

export default SelectInput;
