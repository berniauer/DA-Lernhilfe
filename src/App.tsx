import React, { useState, useEffect } from 'react';
import { Sun, Moon, AlertCircle, X } from 'lucide-react';
import { TopBar, ActiveView } from './components/TopBar';
import { JourneyView } from './components/JourneyView';
import { QuizTrainerView } from './components/QuizTrainerView';
import { GlossaryView } from './components/GlossaryView';
import { ErrorBoundary } from './components/ErrorBoundary';
import {
  FirebaseProgressProvider,
  useFirebaseProgress,
} from './contexts/FirebaseProgressContext';

const AppShell: React.FC = () => {
  const [activeView, setActiveView] = useState<ActiveView>('lernreise');
  const [quizDeckOverride, setQuizDeckOverride] = useState<string | undefined>(undefined);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('da-theme');
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {
      // ignore
    }
    return false;
  });

  const { journey, selectStage, markCheckPassed, authError, clearAuthError } =
    useFirebaseProgress();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    try {
      localStorage.setItem('da-theme', darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

  const handleSelectStage = (index: number) => {
    selectStage(index);
    setActiveView('lernreise');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuizDeck = (deckId: string) => {
    setQuizDeckOverride(deckId);
    setActiveView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FA] dark:bg-[#0D1418] text-[#111E24] dark:text-[#E6EFF3]">
      <TopBar
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {authError && (
        <div
          role="alert"
          className="bg-[#FDF4F3] dark:bg-[#331B19] border-b border-[#EBC5C0] dark:border-[#5C2D28]"
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#8E241A] dark:text-[#F6ACA3]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{authError}</span>
            </div>
            <button
              type="button"
              onClick={clearAuthError}
              aria-label="Hinweis schließen"
              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1">
        {activeView === 'lernreise' && (
          <JourneyView
            activeStageIndex={journey.stageIndex}
            onSelectStage={handleSelectStage}
            completedChecks={journey.completedChecks}
            onMarkCheckPassed={markCheckPassed}
            onOpenQuizDeck={handleOpenQuizDeck}
          />
        )}

        {activeView === 'quiz' && <QuizTrainerView initialDeckId={quizDeckOverride} />}

        {activeView === 'glossar' && <GlossaryView />}
      </div>

      <footer className="mt-12 border-t border-[#DCE4E8] dark:border-[#22323B] py-5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs text-[#526771] dark:text-[#93AAB5]">
          <span>DA Lernreise & Klausurtrainer · Bayes · stan_glm · logit · LOO · daatools</span>
          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#CBD7DD] dark:border-[#2A3E48] hover:border-[#0F6B75] text-[#1F333D] dark:text-[#D5E3EA] cursor-pointer"
          >
            {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            {darkMode ? 'Helles Design' : 'Dunkles Design'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => (
  <ErrorBoundary>
    <FirebaseProgressProvider>
      <AppShell />
    </FirebaseProgressProvider>
  </ErrorBoundary>
);

export default App;
