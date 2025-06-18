
import React from 'react';
import { XIcon } from './icons/LucideIcons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--bg-card)] text-[var(--fg-primary)] p-6 rounded-lg shadow-xl max-w-lg w-full mx-4"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-bold text-[var(--accent)]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[var(--fg-muted)] hover:text-[var(--fg-primary)] transition-colors"
            aria-label="Close modal"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="text-sm text-[var(--fg-muted)] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
