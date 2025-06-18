import React from 'react';
import { FormGroup as FormGroupType, FormField, PromptData, PromptDataValue, OptionMap } from '../../types';
import TagInput from './TagInput';
import SelectInput from './SelectInput';
import MultiSelectInput from './MultiSelectInput'; // Import new component
import { InfoIcon } from '../icons/LucideIcons';
import { useAppStore } from '../../store/useAppStore'; // For openHelpModal

interface FormFieldGroupProps {
  group: FormGroupType;
  data: PromptData; 
  onUpdateField: (fieldId: string, value: PromptDataValue) => void;
  currentEraValue?: string; 
  getOptionMapKey: (fieldId: string) => keyof OptionMap | undefined; 
}

const FormFieldGroup: React.FC<FormFieldGroupProps> = ({ group, data, onUpdateField, currentEraValue, getOptionMapKey }) => {
  const openHelpModal = useAppStore(state => state.openHelpModal);
  
  return (
    <div className="mb-6 p-4 bg-[var(--bg-card)] rounded-lg shadow">
      <h3 className="text-lg font-semibold text-[var(--accent)] mb-3">{group.title}</h3>
      {group.fields.map(field => (
        <div key={field.id} className="relative">
          {field.type === 'select' && field.optionsKey ? (
            <SelectInput
              id={field.optionsKey} 
              label={field.label}
              value={data[field.id]}
              onChange={(newValue) => onUpdateField(field.id, newValue)}
              optionsKey={field.optionsKey} 
              placeholder={field.placeholder || "Select an option"}
              allowCustom={field.allowCustom}
              currentEraValue={field.id !== 'era' ? currentEraValue : undefined} 
            />
          ) : field.type === 'multiselect' && field.optionsKey ? ( // Handle multiselect
            <MultiSelectInput
              id={field.optionsKey}
              label={field.label}
              selectedValues={ (Array.isArray(data[field.id]) ? data[field.id] : []) as string[] }
              onChange={(newValues) => onUpdateField(field.id, newValues)}
              optionsKey={field.optionsKey}
              placeholder={field.placeholder || "Select options..."}
              currentEraValue={currentEraValue} // Pass era for filtering
            />
          ) : (
            <TagInput
              id={field.id}
              label={field.label}
              placeholder={field.placeholder}
              values={Array.isArray(data[field.id]) ? data[field.id] as string[] : (typeof data[field.id] === 'string' && data[field.id] !== '' ? [data[field.id] as string] : [])}
              onChange={(newValues) => onUpdateField(field.id, newValues)}
              type={field.type as 'text' | 'textarea'}
            />
          )}
          
          {(field.id === 'era' || field.optionsKey === 'era' || field.id === 'keyElements') && ( 
            <button 
              onClick={() => openHelpModal(field.id === 'era' ? 'eraHint' : 'sceneDNA')} // keyElements can use sceneDNA help
              className="absolute top-0 end-0 mt-1 me-1 text-[var(--fg-muted)] hover:text-[var(--accent)] z-10"
              title={`Help for ${field.label}`}
              style={{ transform: 'translateY(5px)'}}
            >
              <InfoIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormFieldGroup;