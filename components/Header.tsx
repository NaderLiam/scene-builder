
import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { APP_TITLE } from '../constants';
import { MoonIcon, SunIcon, InfoIcon } from './icons/LucideIcons'; // Removed HomeIcon

const Header: React.FC = () => {
  const theme = useAppStore(state => state.theme);
  const setTheme = useAppStore(state => state.setTheme);
  const direction = useAppStore(state => state.direction);
  const setDirection = useAppStore(state => state.setDirection);
  const openHelpModal = useAppStore(state => state.openHelpModal);
  const currentView = useAppStore(state => state.currentView);
  const navigateTo = useAppStore(state => state.navigateTo);


  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleDirection = () => {
    setDirection(direction === 'ltr' ? 'rtl' : 'ltr');
  };

  return (
    <header className="p-4 bg-[var(--bg-card)] shadow-md flex items-center justify-between sticky top-0 z-40 h-[var(--header-height,68px)]">
      <div className="flex items-center">
        {currentView !== 'home' && (
           <button
            onClick={() => navigateTo('home')}
            title="Go to Home"
            className="p-2 rounded-full hover:bg-[var(--bg-input)] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors me-2" // Added me-2
          >
            {/* Using a simple text or a proper HomeIcon if available and preferred */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </button>
        )}
        <h1 className="text-2xl font-bold gradient-text">
          {APP_TITLE}
        </h1>
      </div>
      <div className="flex items-center space-x-3 rtl:space-x-reverse">
        <button
          onClick={() => openHelpModal('welcome')}
          title="Help / Welcome"
          className="p-2 rounded-full hover:bg-[var(--bg-input)] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
        >
          <InfoIcon className="w-5 h-5" />
        </button>
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="p-2 rounded-full hover:bg-[var(--bg-input)] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
        >
          {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
        </button>
        <button
          onClick={toggleDirection}
          title={`Switch to ${direction === 'ltr' ? 'Right-to-Left (RTL)' : 'Left-to-Right (LTR)'}`}
          className="p-2 rounded-full hover:bg-[var(--bg-input)] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors font-semibold"
        >
          {direction === 'ltr' ? 'AR' : 'EN'}
        </button>
      </div>
    </header>
  );
};

export default Header;