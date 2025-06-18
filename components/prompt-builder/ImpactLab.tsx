
import React from 'react';
import { CreativeConcept, CreativeConceptCategory } from '../../types';
import { ChevronDownIcon, ChevronRightIcon, XCircleIcon } from '../icons/LucideIcons';

interface ImpactLabProps {
  selectedConceptId?: string;
  onSelectConcept: (conceptId: string) => void;
  onClearSelection: () => void;
  categories: CreativeConceptCategory[];
  concepts: CreativeConcept[];
  expandedCategory: string | null;
  onToggleCategory: (categoryId: string) => void;
  direction: 'ltr' | 'rtl';
}

const ImpactLab: React.FC<ImpactLabProps> = ({
  selectedConceptId,
  onSelectConcept,
  onClearSelection,
  categories,
  concepts,
  expandedCategory,
  onToggleCategory,
  direction,
}) => {
  return (
    <div className="space-y-2">
      {selectedConceptId && (
        <div className="flex justify-end mb-2">
            <button
            onClick={onClearSelection}
            className="px-2 py-1 text-xs font-medium rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors flex items-center"
            >
            <XCircleIcon className="w-3 h-3 me-1" /> Clear Selection
            </button>
        </div>
      )}
      {categories.map(category => {
        const conceptsInCategory = concepts.filter(c => c.category === category.id);
        if (conceptsInCategory.length === 0) return null;

        const isCategoryExpanded = expandedCategory === category.id;
        const CategoryChevronIcon = isCategoryExpanded ? ChevronDownIcon : (direction === 'rtl' ? ChevronRightIcon : ChevronRightIcon);

        return (
          <div key={category.id} className="border border-[var(--bg-input)] rounded-md">
            <button
              type="button"
              onClick={() => onToggleCategory(category.id)}
              className="flex items-center justify-between w-full p-2.5 text-xs font-semibold text-left text-[var(--accent-dark)] hover:bg-[var(--bg-input)] transition-colors focus:outline-none"
              aria-expanded={isCategoryExpanded}
            >
              <span className="truncate">{category.title}</span>
              <CategoryChevronIcon className={`w-4 h-4 transform transition-transform ${isCategoryExpanded ? (direction === 'rtl' ? 'rotate-180': '') : (direction === 'rtl' ? '-rotate-90' : '') } flex-shrink-0`} />
            </button>
            {isCategoryExpanded && (
              <div className="p-2.5 border-t border-[var(--bg-input)] space-y-2">
                <p className="text-xs text-[var(--fg-muted)] mb-1">{category.description}</p>
                {conceptsInCategory.map(concept => (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => onSelectConcept(concept.id)}
                    className={`w-full text-left p-2 rounded-md border transition-colors
                                            ${selectedConceptId === concept.id
                                                ? 'bg-[var(--accent)] text-[var(--bg-surface-dark)] border-[var(--accent-hover)] ring-2 ring-[var(--accent)]'
                                                : 'bg-[var(--bg-input)] text-[var(--fg-primary)] border-transparent hover:bg-opacity-70 hover:border-[var(--accent)]'
                                            }`}
                  >
                    <div className="font-semibold text-xs">{concept.title}</div>
                    <div className={`text-xs ${selectedConceptId === concept.id ? 'text-[var(--bg-surface)] opacity-90' : 'text-[var(--fg-muted)]'}`}>
                      {concept.psychologicalEffect}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ImpactLab;
