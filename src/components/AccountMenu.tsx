import React, { useState, useRef, useEffect } from 'react';
import { Cloud, CloudOff, LogOut, Loader2, Check } from 'lucide-react';
import { useFirebaseProgress } from '../contexts/FirebaseProgressContext';

const GoogleMark: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.57-5.15 3.57-8.64Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.29 14.29A7.18 7.18 0 0 1 4.91 12c0-.79.14-1.56.38-2.29v-3.1H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.39l4-3.1Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.76c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.61l4 3.1c.94-2.84 3.59-4.95 6.71-4.95Z"
    />
  </svg>
);

export const AccountMenu: React.FC = () => {
  const { user, authReady, authBusy, syncStatus, signInWithGoogle, signOutUser } =
    useFirebaseProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  if (!authReady) {
    return (
      <div
        aria-label="Kontostatus wird geladen"
        className="h-9 w-24 rounded-lg bg-[#E6EEF1] dark:bg-[#192830] animate-pulse shrink-0"
      />
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        disabled={authBusy}
        onClick={() => void signInWithGoogle()}
        className="inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg border border-[#CBD7DD] dark:border-[#2A3E48] bg-white dark:bg-[#131F26] text-[#0E1E25] dark:text-[#EEF4F7] hover:border-[#0F6B75] dark:hover:border-[#5DC2CC] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B75]"
      >
        {authBusy ? (
          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-[#0F6B75]" aria-hidden="true" />
        ) : (
          <GoogleMark className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        )}
        <span className="hidden sm:inline">Mit Google anmelden</span>
        <span className="sm:hidden">Anmelden</span>
      </button>
    );
  }

  const displayName = user.displayName || user.email || 'Konto';
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2) || 'G';

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label={`Konto von ${displayName} öffnen`}
        onClick={() => setMenuOpen((o) => !o)}
        className="inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-lg border border-[#CBD7DD] dark:border-[#2A3E48] bg-white dark:bg-[#131F26] hover:border-[#0F6B75] dark:hover:border-[#5DC2CC] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0F6B75]"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            className="w-6 h-6 rounded-full object-cover shrink-0"
          />
        ) : (
          <span className="w-6 h-6 rounded-full bg-[#0F6B75] text-white text-xs font-bold flex items-center justify-center shrink-0">
            {initials}
          </span>
        )}
        <span className="hidden sm:inline text-xs font-semibold text-[#0E1E25] dark:text-[#EEF4F7] max-w-[120px] truncate">
          {displayName.split(' ')[0]}
        </span>
        {syncStatus === 'syncing' ? (
          <Loader2
            className="w-3.5 h-3.5 animate-spin text-[#0F6B75] dark:text-[#5DC2CC] shrink-0"
            aria-label="Synchronisiert"
          />
        ) : syncStatus === 'error' ? (
          <CloudOff className="w-3.5 h-3.5 text-[#C0392B] shrink-0" aria-label="Sync-Fehler" />
        ) : (
          <Cloud className="w-3.5 h-3.5 text-[#0F7B4D] dark:text-[#5DD49B] shrink-0" aria-label="Synchronisiert" />
        )}
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] shadow-lg p-4 space-y-3 z-50"
        >
          <div className="space-y-0.5 border-b border-[#E5ECEF] dark:border-[#22323B] pb-3">
            <div className="font-display font-bold text-sm text-[#0E1E25] dark:text-white truncate">
              {displayName}
            </div>
            {user.email && (
              <div className="text-xs text-[#526771] dark:text-[#93AAB5] truncate">{user.email}</div>
            )}
          </div>

          <div className="flex items-start gap-2 text-xs text-[#314650] dark:text-[#BFD1DA] leading-relaxed">
            {syncStatus === 'syncing' ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0F6B75] shrink-0 mt-0.5" />
            ) : syncStatus === 'error' ? (
              <CloudOff className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
            ) : (
              <Check className="w-4 h-4 text-[#0F7B4D] dark:text-[#5DD49B] shrink-0 mt-0.5" />
            )}
            <span>
              {syncStatus === 'syncing'
                ? 'Fortschritt wird gerade mit der Cloud abgeglichen…'
                : syncStatus === 'error'
                  ? 'Cloud-Sync pausiert – Änderungen bleiben lokal gespeichert.'
                  : 'Cloud-Sync aktiv: Lernreise & Quiz-Fortschritt sind auf Handy und Computer synchron.'}
            </span>
          </div>

          <button
            type="button"
            role="menuitem"
            disabled={authBusy}
            onClick={() => {
              setMenuOpen(false);
              void signOutUser();
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg border border-[#CBD7DD] dark:border-[#2A3E48] text-[#1F333D] dark:text-[#D5E3EA] hover:border-[#C0392B] hover:text-[#A82E22] dark:hover:text-[#F49388] transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
            Abmelden
          </button>
        </div>
      )}
    </div>
  );
};
