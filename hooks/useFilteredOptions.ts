
import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { OptionMap, OptionSet } from '../types';

// Hook to get filtered options for a specific field
export function useFilteredOptions(
  fieldId: keyof OptionMap | undefined, // fieldId can be undefined if FormField has no optionsKey
  currentContext?: { era?: string; userId?: string } // userId for future use
): OptionSet[] {
  const getOptions = useAppStore(state => state.getOptionsForField);
  // Subscribe to customOptions to re-fetch when they change.
  // This is a bit indirect; ideally, getOptionsForField would be a selector that causes re-render.
  // For now, explicitly watch customOptions length or a deep comparison if necessary.
  const customOptionsVersion = JSON.stringify(useAppStore(state => state.customOptions));


  const [options, setOptions] = useState<OptionSet[]>([]);

  useEffect(() => {
    if (!fieldId) {
      setOptions([]);
      return;
    }
    const newOptions = getOptions(fieldId, currentContext);
    setOptions(newOptions);
  }, [fieldId, currentContext?.era, currentContext?.userId, getOptions, customOptionsVersion]);

  return options;
}
