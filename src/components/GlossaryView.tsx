import React, { useState, useMemo } from 'react';
import { Search, AlertTriangle, Calculator } from 'lucide-react';
import { GLOSSARY_ENTRIES, GlossaryCategory } from '../lib/glossary';

const CATEGORIES: ('Alle' | GlossaryCategory)[] = [
  'Alle',
  'Grundlagen & Bayes',
  'Lineare Regression',
  'Diagnose & MCMC',
  'Vorhersage & Entscheidung',
  'Kausalität & Effekte',
  'Interaktion & Vergleich',
  'Logistische Regression',
  'Daten & Betrieb',
];

export const GlossaryView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'Alle' | GlossaryCategory>('Alle');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return GLOSSARY_ENTRIES.filter((entry) => {
      if (category !== 'Alle' && entry.category !== category) return false;
      if (!q) return true;
      const haystack = [
        entry.term,
        ...(entry.aliases ?? []),
        entry.simple,
        entry.formula ?? '',
        entry.trap ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    }).sort((a, b) => a.term.localeCompare(b.term, 'de'));
  }, [query, category]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0E1E25] dark:text-white">
          Greenhorn-Glossar (A–Z)
        </h1>
        <p className="text-sm text-[#4E626C] dark:text-[#96AEB9]">
          Alle {GLOSSARY_ENTRIES.length} Klausur-Fachbegriffe in Klartext – jeder dieser Begriffe erklärt
          sich in der Lernreise und im Quiz zusätzlich automatisch beim Hovern.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="w-4 h-4 text-[#637985] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Begriff, R-Funktion oder Formel suchen (z. B. Brier, Rhat, Odds, Confounder)…"
            aria-label="Glossar durchsuchen"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#CBD7DD] dark:border-[#2A3E48] bg-white dark:bg-[#131F26] text-[#111E24] dark:text-[#E6EFF3] placeholder:text-[#788D97]"
          />
        </div>

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Glossar nach Thema filtern">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                category === cat
                  ? 'bg-[#0F6B75] text-white border-[#0F6B75]'
                  : 'bg-white dark:bg-[#131F26] text-[#354B55] dark:text-[#A4BBC5] border-[#DCE4E8] dark:border-[#24343E] hover:border-[#0F6B75]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <div className="text-xs font-mono text-[#526771] dark:text-[#93AAB5] tabular-nums">
        {filtered.length} {filtered.length === 1 ? 'Eintrag' : 'Einträge'} angezeigt
      </div>

      {/* Glossary Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] p-8 text-center text-sm text-[#526771] dark:text-[#93AAB5]">
          Kein Begriff passt zu „{query}“. Versuche einen anderen Suchbegriff oder wähle „Alle“.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((entry) => (
            <article
              key={entry.id}
              className="rounded-xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] p-5 flex flex-col gap-2.5"
            >
              <div>
                <h2 className="font-display font-bold text-base text-[#0E1E25] dark:text-white">
                  {entry.term}
                </h2>
                <div className="text-xs text-[#5B707A] dark:text-[#8FA7B3] mt-0.5">
                  {entry.category} · {entry.chapter}
                  {entry.aliases && entry.aliases.length > 0 && (
                    <span> · auch: {entry.aliases.slice(0, 3).join(', ')}</span>
                  )}
                </div>
              </div>

              <p className="text-sm leading-relaxed text-[#22343D] dark:text-[#CEE0E7]">
                {entry.simple}
              </p>

              {entry.formula && (
                <div className="pt-2 border-t border-[#EDF2F4] dark:border-[#22333D] flex items-start gap-2">
                  <Calculator className="w-3.5 h-3.5 text-[#0F6B75] dark:text-[#5DC2CC] shrink-0 mt-0.5" aria-hidden="true" />
                  <code className="font-mono text-xs text-[#0B4D55] dark:text-[#8CDCE4]">
                    {entry.formula}
                  </code>
                </div>
              )}

              {entry.trap && (
                <div className="rounded-lg bg-[#FDF5E8] dark:bg-[#2B2112] border border-[#EFD7AE] dark:border-[#533D1B] px-3 py-2 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F5B041] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs leading-snug text-[#7A3908] dark:text-[#F8D093]">
                    <strong className="font-semibold">Klausur-Falle:</strong> {entry.trap}
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
