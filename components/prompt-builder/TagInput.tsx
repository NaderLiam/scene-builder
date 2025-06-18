
import React, { useState, KeyboardEvent } from 'react';
import { XIcon } from '../icons/LucideIcons';

interface TagInputProps {
  id: string;
  label: string;
  placeholder?: string;
  values: string[];
  onChange: (newValues: string[]) => void;
  type?: 'text' | 'textarea';
}

const TagInput: React.FC<TagInputProps> = ({ id, label, placeholder, values, onChange, type = 'text' }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = () => {
    const newTag = inputValue.trim();
    if (newTag && !values.includes(newTag)) {
      onChange([...values, newTag]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && type === 'text') {
      e.preventDefault(); // Prevent form submission if part of a form
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(values.filter(tag => tag !== tagToRemove));
  };
  
  const InputComponent = type === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-[var(--fg-muted)] mb-1">
        {label}
      </label>
      <InputComponent
        id={id}
        type={type === 'textarea' ? undefined : 'text'}
        rows={type === 'textarea' ? 3 : undefined}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={addTag} // Add tag on blur for both input and textarea
        placeholder={placeholder}
        className="w-full p-2 bg-[var(--bg-input)] text-[var(--fg-primary)] border border-transparent rounded-md focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-colors"
      />
      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {values.map(tag => (
            <span
              key={tag}
              className="flex items-center bg-[var(--accent)] text-[var(--bg-surface-dark)] text-xs font-semibold px-2 py-1 rounded-full"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ms-2 text-[var(--bg-surface-dark)] hover:text-red-300 transition-colors"
                aria-label={`Remove ${tag}`}
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

export default TagInput;
