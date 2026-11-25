import React from 'react';
import { FIREBASE_PROJECT_ID, FIRESTORE_DATABASE_ID } from '../firebase';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
  isQuotaError: boolean;
  isDailyReadQuota: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
      isQuotaError: false,
      isDailyReadQuota: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    const raw = error?.message || 'Unbekannter Fehler';
    const isQuotaError = raw.includes('Quota exceeded');
    const isDailyReadQuota = raw.includes(
      "Quota exceeded for quota metric 'Free daily read units per project (free tier database)'"
    );
    return {
      hasError: true,
      message: raw,
      isQuotaError,
      isDailyReadQuota,
    };
  }

  componentDidCatch(error: Error) {
    console.error('App ErrorBoundary caught error:', error);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const upgradeUrl = `https://console.firebase.google.com/project/${FIREBASE_PROJECT_ID}/firestore/databases/${FIRESTORE_DATABASE_ID}/data?openUpgradeDialog=true`;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FA] dark:bg-[#0D1418] p-6 text-[#111E24] dark:text-[#E6EFF3]">
        <div className="max-w-lg w-full rounded-2xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] p-6 space-y-4">
          <h1 className="font-display font-bold text-xl text-[#0E1E25] dark:text-white">
            {this.state.isQuotaError
              ? 'Datenbank-Kontingent erreicht'
              : 'Etwas ist schiefgelaufen'}
          </h1>
          <p className="text-sm text-[#4E626C] dark:text-[#96AEB9] leading-relaxed">
            {this.state.isQuotaError
              ? 'Das kostenlose tägliche Firestore-Kontingent wurde erreicht und wird morgen automatisch zurückgesetzt. Dein lokal gespeicherter Lernfortschritt bleibt erhalten.'
              : 'Bei der Synchronisierung ist ein Fehler aufgetreten. Lade die Seite neu – dein lokaler Fortschritt im Browser geht nicht verloren.'}
          </p>
          {this.state.isDailyReadQuota && (
            <p className="text-xs text-[#0F6B75] dark:text-[#5DC2CC] break-all">
              Upgrade-Link:{' '}
              <a href={upgradeUrl} target="_blank" rel="noreferrer" className="underline">
                Firebase Console öffnen
              </a>
            </p>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#0F6B75] hover:bg-[#0B565E] text-white cursor-pointer"
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }
}
