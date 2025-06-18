import { PromptData, FormGroup, OptionMap, OptionSet, ShotSpecificData, FormField, CreativeConcept } from '../types';
import { SCENE_DNA_STRUCTURE, SHOT_SPECIFIC_STRUCTURE } from '../constants'; 
import { PROMPT_OPTIONS_DATA } from '../src/data/promptOptions'; // For direct access if needed

// Helper to find an option's display label by its value
function getOptionDisplayLabel(value: string, fieldIdKey: string, staticOptions: OptionMap, customOptions: OptionMap): string {
  const fieldId = fieldIdKey as keyof OptionMap; 
  const allOptionsForField: OptionSet[] = [
    ...(staticOptions[fieldId] || []),
    ...(customOptions[fieldId] || [])
  ];
  const option = allOptionsForField.find(opt => opt.value === value);
  return option ? option.label : value; 
}

// Helper to get concatenated descriptions for selected key elements
function getKeyElementDescriptions(
  keyElementValues: string[] | undefined, // These are the long description strings themselves
  staticOptions: OptionMap,
  customOptions: OptionMap
): string {
  if (!keyElementValues || keyElementValues.length === 0) {
    return "";
  }
  // Since keyElementValues directly store the descriptions (which are the 'value' property of OptionSet for keyElements)
  // we just need to join them.
  // No complex lookup needed if `sceneDna.keyElements` stores the full strings.
  // If `sceneDna.keyElements` stored short unique IDs, then a lookup like getOptionDisplayLabel would be needed here to fetch the OptionSet.value.
  // Based on current setup where OptionSet.value IS the description for keyElements:
  return keyElementValues.join(". ") + (keyElementValues.length > 0 ? "." : ""); // Add a period at the end if not empty.
}


function serializePartialPrompt(
  data: PromptData | ShotSpecificData,
  structure: FormGroup[],
  staticOptions: OptionMap,
  customOptions: OptionMap,
  activeConceptSnippet?: string, // For shot-specific creative concepts
  keyElementsInjection?: string  // For injecting key elements into shot's subject
): string {
  let promptPart = "";
  const allFields = structure.flatMap(group => group.fields);

  for (const field of allFields) {
    if (field.id === 'aspectRatio' && 'aspectRatio' in data) {
      continue;
    }
    // Skip direct serialization of 'keyElements' in sceneDNA part, it's handled via injection.
    if (field.id === 'keyElements' && structure !== SHOT_SPECIFIC_STRUCTURE) { // Only skip if processing Scene DNA
        continue;
    }


    const value = (data as any)[field.id]; 
    if (value === undefined || value === null) continue;

    let partSegment = "";

    if (field.id === 'subject' && structure === SHOT_SPECIFIC_STRUCTURE) { // Ensure this applies only to shot's subject
      const subjectValues = Array.isArray(value) ? value : (typeof value === 'string' && value ? [value] : []);
      let fullSubjectText = subjectValues.join(', ');

      if (keyElementsInjection) {
        if (fullSubjectText.trim()) fullSubjectText += ". ";
        fullSubjectText += keyElementsInjection.trim();
      }
      if (activeConceptSnippet) {
        if (fullSubjectText.trim()) fullSubjectText += ". ";
        fullSubjectText += activeConceptSnippet.trim();
      }
      
      if (fullSubjectText.trim()) {
         partSegment = `${field.label}: ${fullSubjectText.trim()}. `;
      } else {
         partSegment = ""; 
      }
    } else if (field.type === 'select' || (field.optionsKey && field.type !== 'multiselect')) {
      if (typeof value === 'string' && value !== "") {
        const label = getOptionDisplayLabel(value, field.id, staticOptions, customOptions);
        partSegment = `${field.label}: ${label}. `;
      }
    } else if (field.type === 'multiselect') { // For fields like keyElements if they were to be serialized directly (they are not here)
        // This block is effectively unused for keyElements due to the skip above and injection method.
        // Kept for potential future multi-select fields that ARE serialized directly.
      if (Array.isArray(value) && value.length > 0) {
        // For keyElements, `val` is the description itself.
        // If it were short values, we'd look up labels: value.map(val => getOptionDisplayLabel(val, field.id, staticOptions, customOptions)).join(', ')
        partSegment = `${field.label}: ${value.join('; ')}. `;
      }
    } else { // TagInput fields (text, textarea)
      if (Array.isArray(value) && value.length > 0) {
        partSegment = `${field.label}: ${value.join(', ')}. `;
      } else if (typeof value === 'string' && value.length > 0) { 
        partSegment = `${field.label}: ${value}. `;
      }
    }
    promptPart += partSegment;
  }
  return promptPart;
}


export function serializeFullPrompt(
  sceneDna: PromptData,
  shotData: ShotSpecificData, 
  sceneStructure: FormGroup[], 
  shotStructure: FormGroup[],  
  staticOptions: OptionMap,
  customOptions: OptionMap,
  creativeConcepts: CreativeConcept[] 
): string {
  
  const activeConcept = shotData.selectedCreativeConceptId 
    ? creativeConcepts.find(c => c.id === shotData.selectedCreativeConceptId) 
    : undefined;
  const activeConceptSnippet = activeConcept ? activeConcept.promptSnippet : undefined;

  // Get concatenated key element descriptions from sceneDna
  // sceneDna.keyElements already contains the full description strings.
  const keyElementsDescString = (sceneDna.keyElements && sceneDna.keyElements.length > 0)
    ? sceneDna.keyElements.join(". ") + "."
    : "";


  const scenePart = serializePartialPrompt(sceneDna, sceneStructure, staticOptions, customOptions).trim();
  const shotPart = serializePartialPrompt(shotData, shotStructure, staticOptions, customOptions, activeConceptSnippet, keyElementsDescString).trim();

  let combinedParts = [scenePart, shotPart].filter(p => p.length > 0).join(" ");
  
  let arSuffix = "";
  if (sceneDna.aspectRatio && typeof sceneDna.aspectRatio === 'string' && sceneDna.aspectRatio.trim() !== "") {
      arSuffix = ` --ar ${sceneDna.aspectRatio.trim()}`;
  }

  let fullPromptString = combinedParts;
  if (arSuffix) {
      if (fullPromptString.length > 0) {
          fullPromptString += arSuffix; 
      } else {
          fullPromptString = arSuffix.trim(); 
      }
  }
  
  return fullPromptString.replace(/\.\s*\./g, '.').replace(/\s{2,}/g, ' ').trim();
}
