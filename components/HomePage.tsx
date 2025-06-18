
import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { PlusCircleIcon, EditIcon, TrashIcon, Share2Icon } from './icons/LucideIcons'; // Share2Icon for Duplicate
import { Scene } from '../types';
import SceneTemplateLibrary from './TemplateLibrary'; // Reusing the refactored template library

const SceneCard: React.FC<{ scene: Scene }> = ({ scene }) => {
  const navigateTo = useAppStore(state => state.navigateTo);
  const deleteScene = useAppStore(state => state.deleteScene);
  const duplicateScene = useAppStore(state => state.duplicateScene);

  const coreDnaSummary = Object.entries(scene.dna)
    .filter(([key, value]) => value && (typeof value === 'string' && value !== "") || (Array.isArray(value) && value.length > 0))
    .slice(0, 3) // Show first 3 prominent DNA elements
    .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${Array.isArray(value) ? value.join(', ') : value}`)
    .join('; ');

  return (
    <div className="bg-[var(--bg-input)] p-4 rounded-lg shadow-md flex flex-col justify-between transition-all hover:shadow-lg">
      <div>
        <h3 className="text-lg font-semibold text-[var(--accent)] mb-1 truncate" title={scene.title}>{scene.title}</h3>
        <p className="text-xs text-[var(--fg-muted)] mb-2">
          {scene.storyboard.length} shot(s) &bull; Last updated: {new Date(scene.timestamp).toLocaleDateString()}
        </p>
        <p className="text-xs text-[var(--fg-primary)] mb-3 truncate" title={coreDnaSummary || "No DNA details yet"}>
          {coreDnaSummary || "No DNA details yet..."}
        </p>
      </div>
      <div className="flex space-x-2 rtl:space-x-reverse mt-auto pt-2 border-t border-[var(--bg-card)]">
        <button
          onClick={() => navigateTo('storyboard', scene.id)}
          className="px-3 py-1.5 text-xs font-medium rounded-md bg-[var(--accent)] text-[var(--bg-surface-dark)] hover:bg-[var(--accent-hover)] transition-colors"
        >
          Open Storyboard
        </button>
        <button
          onClick={() => navigateTo('sceneSettings', scene.id)}
          title="Edit Scene DNA"
          className="p-1.5 text-xs rounded-md text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
        >
          <EditIcon className="w-4 h-4" />
        </button>
         <button
          onClick={() => duplicateScene(scene.id)}
          title="Duplicate Scene"
          className="p-1.5 text-xs rounded-md text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
        >
          <Share2Icon className="w-4 h-4" />
        </button>
        <button
          onClick={() => { if (window.confirm(`Are you sure you want to delete scene "${scene.title}"? This will delete all its shots.`)) deleteScene(scene.id); }}
          title="Delete Scene"
          className="p-1.5 text-xs rounded-md text-red-500 hover:text-red-400 transition-colors ms-auto"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const scenes = useAppStore(state => state.scenes);
  const navigateTo = useAppStore(state => state.navigateTo);
  const createNewScene = useAppStore(state => state.createNewScene); // For creating from template via library

  return (
    <div className="space-y-8">
      <div className="text-center p-6 bg-[var(--bg-card)] rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold gradient-text mb-4">Welcome to the Historical Scene Builder</h2>
        <p className="text-lg text-[var(--fg-muted)] mb-6">
          Craft compelling narratives by defining a master Scene and then populating its Storyboard with unique Shots.
        </p>
        <button
          onClick={() => createNewScene()} // Calls createNewScene which then navigates to sceneSettings
          className="px-8 py-3 text-lg font-semibold rounded-lg bg-[var(--accent)] text-[var(--bg-surface-dark)] hover:bg-[var(--accent-hover)] transition-transform duration-150 ease-in-out hover:scale-105 flex items-center justify-center mx-auto"
        >
          <PlusCircleIcon className="w-6 h-6 me-2" />
          Create New Scene
        </button>
      </div>

      <SceneTemplateLibrary />

      <div>
        <h2 className="text-2xl font-semibold text-[var(--fg-primary)] mb-4">My Scenes Library</h2>
        {scenes.length === 0 ? (
          <p className="text-center text-[var(--fg-muted)] py-8 bg-[var(--bg-card)] rounded-lg shadow">
            You haven't created any scenes yet. Click "Create New Scene" to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scenes.slice().sort((a,b) => b.timestamp - a.timestamp).map(scene => (
              <SceneCard key={scene.id} scene={scene} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
