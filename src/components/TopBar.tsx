import React from 'react';
import { AccountMenu } from './AccountMenu';

export type ActiveView = 'grundbegriffe' | 'lernreise' | 'quiz' | 'glossar';

interface TopBarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeView, onSelectView }) => {
  const navItems: { id: ActiveView; label: string; mobileLabel: string }[] = [
    { id: 'grundbegriffe', label: 'Grundbegriffe', mobileLabel: 'Basics' },
    { id: 'lernreise', label: 'Lernreise', mobileLabel: 'Reise' },
    { id: 'quiz', label: 'Karten & Quiz', mobileLabel: 'Quiz' },
    { id: 'glossar', label: 'Glossar', mobileLabel: 'Glossar' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F7F9FA]/95 dark:bg-[#0D1418]/95 backdrop-blur-sm border-b border-[#DCE4E8] dark:border-[#22323B]">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectView('grundbegriffe')}
          aria-label="DA Lernreise Startseite"
          className="font-display font-bold text-sm sm:text-lg tracking-tight text-[#0E1E25] dark:text-[#EEF4F7] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0F6B75] rounded"
        >
          <span className="hidden sm:inline">DA Lernreise</span>
          <span className="sm:hidden">DA</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav aria-label="Hauptnavigation" className="flex items-center gap-2.5 sm:gap-7">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-[#0F6B75] rounded ${
                  isActive
                    ? 'text-[#0F6B75] dark:text-[#5DC2CC] font-semibold'
                    : 'text-[#4E626C] dark:text-[#96AEB9] hover:text-[#0E1E25] dark:hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.mobileLabel}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[17px] h-0.5 bg-[#0F6B75] dark:bg-[#5DC2CC]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Google Sign-In & Cloud Sync Account Control */}
        <AccountMenu />
      </div>
    </header>
  );
};
