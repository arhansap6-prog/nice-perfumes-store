import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-24 right-5 z-50 bg-neutral-900/95 border border-neutral-700 text-neutral-100 px-5 py-3 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
      <Sparkles className="w-4 h-4 text-white flex-shrink-0" />
      <span className="text-xs tracking-wide font-medium">{toastMessage}</span>
    </div>
  );
};
