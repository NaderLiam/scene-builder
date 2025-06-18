
import React from 'react';
import { Shot, ShotSpecificData } from '../types';
import { useAppStore } from '../store/useAppStore';
import { TrashIcon, EditIcon, CopyIcon } from './icons/LucideIcons';

interface ShotCardProps {
  shot: Shot;
  onEdit: (shot: Shot) => void; // Callback to populate edit form for this shot
}

const ShotCard: React.FC<ShotCardProps> = ({ shot, onEdit }) => {
  const deleteShotFromCurrentScene = useAppStore(state => state.deleteShotFromCurrentScene);
  const currentSceneId = useAppStore(state => state.currentSceneId);

  const handleCopyPrompt = async () => {
    if (!shot.generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(shot.generatedPrompt);
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement) activeElement.classList.add('copy-prompt-button');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text. See console for details.');
    }
  };
  
  const getSummary = (data: ShotSpecificData): string => {
    let summaryParts: string[] = [];
    if(data.subject && Array.isArray(data.subject) && data.subject.length > 0) {
      summaryParts.push(`Subject: ${data.subject.join(', ').substring(0,30)}...`);
    }

    if(data.cameraAngle) summaryParts.push(`Angle: ${data.cameraAngle}`);
    if(data.lens) summaryParts.push(`Lens: ${data.lens}`);
    return summaryParts.join('; ') || "General shot";
  }

  return (
    <div className="bg-[var(--bg-input)] p-3 rounded-lg shadow-md flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm font-semibold text-[var(--fg-primary)] break-all" title={shot.name || `Shot ${shot.id.slice(-4)}`}>{shot.name || `Shot ${shot.id.slice(-4)}`}</h4>
            {shot.previewImageUrl && (
                <img src={shot.previewImageUrl} alt={`Preview for ${shot.name || shot.id}`} className="w-16 h-12 rounded object-cover ms-2 border border-[var(--bg-card)]"/>
            )}
        </div>
         <p className="text-xs text-[var(--accent-dark)] mb-1 italic truncate" title={getSummary(shot.shotSpecificData)}>
            {getSummary(shot.shotSpecificData)}
        </p>
        <p className="text-[0.65rem] leading-tight text-[var(--fg-muted)] max-h-20 overflow-y-auto mb-2 scrollbar-thin scrollbar-thumb-[var(--bg-card)] scrollbar-track-[var(--bg-input)]">
          {shot.generatedPrompt}
        </p>
      </div>
      <div className="flex space-x-1 rtl:space-x-reverse mt-auto pt-2 border-t border-[var(--bg-card)] items-center">
        <button
          onClick={handleCopyPrompt}
          title="Copy full prompt"
          className="p-1 text-xs rounded-md text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors copy-prompt-button"
        >
          <CopyIcon className="w-3 h-3" />
        </button>
        <button
          onClick={() => onEdit(shot)} // Pass the full shot object
          title="Edit this shot's details"
          className="p-1 text-xs rounded-md text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
        >
          <EditIcon className="w-3 h-3" />
        </button>
        <button
          onClick={() => { if(currentSceneId && window.confirm(`Are you sure you want to delete shot "${shot.name || shot.id.slice(-4)}"?`)) deleteShotFromCurrentScene(shot.id) }}
          title="Delete this shot"
          className="p-1 text-xs rounded-md text-red-500 hover:text-red-400 transition-colors ms-auto"
        >
          <TrashIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default ShotCard;
