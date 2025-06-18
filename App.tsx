
import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import Header from './components/Header';
import Modal from './components/Modal';
import CustomOptionModal from './components/CustomOptionModal';
import AdminOptionsPanel from './components/admin/AdminOptionsPanel';
import { DOCS_CONTENT } from './constants';
import { SettingsIcon } from './components/icons/LucideIcons';

// New Page/View Components (will be created in separate files)
import HomePage from './components/HomePage';
import SceneSettingsPage from './components/SceneSettingsPage';
import StoryboardPage from './components/StoryboardPage';
// Placeholder for SceneTemplateLibrary, old TemplateLibrary is removed
// import SceneTemplateLibrary from './components/SceneTemplateLibrary'; 


const App: React.FC = () => {
  const theme = useAppStore(state => state.theme);
  const direction = useAppStore(state => state.direction);
  const currentView = useAppStore(state => state.currentView);
  const currentSceneId = useAppStore(state => state.currentSceneId);

  const isHelpModalOpen = useAppStore(state => state.isHelpModalOpen);
  const closeHelpModal = useAppStore(state => state.closeHelpModal);
  const helpModalContentKey = useAppStore(state => state.helpModalContentKey);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);
  
  useEffect(() => {
    const handleCopy = (event: ClipboardEvent) => {
      // Check if the copy event originated from a button with specific class or attribute if needed
      if (document.activeElement && document.activeElement.classList.contains('copy-prompt-button')) {
          setToastMessage("Prompt copied to clipboard!");
          setTimeout(() => setToastMessage(null), 2000);
      }
    };
    // Listening on document for copy events triggered by navigator.clipboard.writeText
    // This is a bit broad. A more targeted approach might involve custom events or context.
    // For now, assume any programmatic copy is for prompts.
    document.addEventListener('copy', handleCopy as EventListener);
    return () => document.removeEventListener('copy', handleCopy as EventListener);
  }, []);

  const currentDoc = helpModalContentKey ? DOCS_CONTENT[helpModalContentKey] : null;

  const renderView = () => {
    switch (currentView) {
      case 'sceneSettings':
        return <SceneSettingsPage />;
      case 'storyboard':
        if (currentSceneId) {
          return <StoryboardPage sceneId={currentSceneId} />;
        }
        // Fallback or error if storyboard view is active without a sceneId
        return <HomePage />; // Or some error message component
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-surface)] text-[var(--fg-primary)] transition-colors duration-300">
      <Header />
      <main className="container mx-auto p-4 max-w-7xl">
        {renderView()}
      </main>
      <footer className="text-center p-4 text-xs text-[var(--fg-muted)] border-t border-[var(--bg-input)] mt-8">
        Historical-Scene Prompt Builder &copy; {new Date().getFullYear()}. For AI Exploration.
        <button 
          onClick={() => setIsAdminPanelOpen(true)} 
          title="Admin: Manage Options"
          className="ms-4 p-1 rounded-full hover:bg-[var(--bg-input)] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </footer>

      {toastMessage && (
        <div className="fixed bottom-5 end-5 bg-[var(--accent)] text-[var(--bg-surface-dark)] px-4 py-2 rounded-md shadow-lg transition-opacity duration-300 z-[100]">
          {toastMessage}
        </div>
      )}

      <Modal
        isOpen={isHelpModalOpen && currentDoc != null}
        onClose={closeHelpModal}
        title={currentDoc?.title || "Help"}
      >
        {currentDoc?.content || "No help content available for this topic."}
      </Modal>

      <CustomOptionModal /> 
      
      {isAdminPanelOpen && <AdminOptionsPanel onClose={() => setIsAdminPanelOpen(false)} />}
    </div>
  );
};

export default App;
