import { ShotSpecificData, FormField } from '../types';
import { SHOT_SPECIFIC_STRUCTURE } from '../constants';

// Helper to generate initial empty data for shot specifics
export const generateInitialShotData = (): ShotSpecificData => {
  const initialData: ShotSpecificData = {
    subject: [],
    details: [],
    // Defaults from structure
    cameraAngle: SHOT_SPECIFIC_STRUCTURE.flatMap(g => g.fields).find(f => f.id === 'cameraAngle')?.defaultValue as string || "",
    lens: SHOT_SPECIFIC_STRUCTURE.flatMap(g => g.fields).find(f => f.id === 'lens')?.defaultValue as string || "",
    aperture: SHOT_SPECIFIC_STRUCTURE.flatMap(g => g.fields).find(f => f.id === 'aperture')?.defaultValue as string || "",
    selectedCreativeConceptId: undefined,
  };
  
  SHOT_SPECIFIC_STRUCTURE.flatMap(g => g.fields).forEach((field: FormField) => {
    const fieldKey = field.id as keyof ShotSpecificData;
    if (!(fieldKey in initialData) || initialData[fieldKey] === undefined) { 
        if (field.type === 'select' || field.optionsKey) {
            (initialData as any)[fieldKey] = (field.defaultValue && typeof field.defaultValue === 'string') ? field.defaultValue : "";
        } else {
             const dv = field.defaultValue;
             (initialData as any)[fieldKey] = dv ? (Array.isArray(dv) ? dv : [dv]) : [];
        }
    }
  });
  return initialData;
};
