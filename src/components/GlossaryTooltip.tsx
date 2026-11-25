import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, AlertTriangle, Calculator } from 'lucide-react';
import { GlossaryEntry, tokenizeWithGlossary } from '../lib/glossary';

interface TooltipPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom';
}

interface GlossaryTermProps {
  entry: GlossaryEntry;
  children: React.ReactNode;
}

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ entry, children }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<TooltipPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const tooltipWidth = Math.min(340, window.innerWidth - 24);
    const spaceAbove = rect.top;
    const placement: 'top' | 'bottom' = spaceAbove > 210 ? 'top' : 'bottom';
    const rawLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
    const clampedLeft = Math.max(12, Math.min(rawLeft, window.innerWidth - tooltipWidth - 12));
    const top = placement === 'top' ? rect.top - 10 : rect.bottom + 10;

    setPos({ top, left: clampedLeft, placement });
  }, []);

  const handleOpen = useCallback(() => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    updatePosition();
    setOpen(true);
  }, [updatePosition]);

  const handleCloseDelayed = useCallback(() => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 120);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updatePosition();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onOutsideClick = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onOutsideClick);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onOutsideClick);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={handleOpen}
        onMouseLeave={handleCloseDelayed}
        onFocus={handleOpen}
        onBlur={handleCloseDelayed}
        onClick={(e) => {
          e.stopPropagation();
          if (open) {
            setOpen(false);
          } else {
            handleOpen();
          }
        }}
        aria-expanded={open}
        className="inline font-medium text-[#0B5A63] dark:text-[#66C7D1] border-b border-dotted border-[#0F6B75]/75 dark:border-[#66C7D1]/75 hover:bg-[#0F6B75]/10 dark:hover:bg-[#66C7D1]/15 rounded-xs px-0.5 -mx-0.5 transition-colors cursor-help focus-visible:outline-2 focus-visible:outline-[#0F6B75] focus-visible:outline-offset-2"
      >
        {children}
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            role="tooltip"
            onMouseEnter={handleOpen}
            onMouseLeave={handleCloseDelayed}
            style={{
              position: 'fixed',
              left: `${pos.left}px`,
              top: `${pos.top}px`,
              transform: pos.placement === 'top' ? 'translateY(-100%)' : 'translateY(0)',
              width: 'min(340px, calc(100vw - 24px))',
              zIndex: 9999,
            }}
            className="rounded-xl bg-[#FFFFFF] dark:bg-[#17252D] text-[#111E24] dark:text-[#E6EFF3] border border-[#CBD7DD] dark:border-[#2C404B] shadow-xl p-4 text-left pointer-events-auto"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="font-display font-bold text-sm text-[#0D1F27] dark:text-white leading-tight">
                  {entry.term}
                </div>
                <div className="text-xs text-[#546873] dark:text-[#93AAB5] mt-0.5">
                  {entry.category} · {entry.chapter}
                </div>
              </div>
              <BookOpen className="w-4 h-4 text-[#0F6B75] dark:text-[#5DC2CC] shrink-0 mt-0.5" aria-hidden="true" />
            </div>

            <p className="text-[13.5px] leading-relaxed text-[#22343D] dark:text-[#D5E3EA]">
              {entry.simple}
            </p>

            {entry.formula && (
              <div className="mt-2.5 pt-2.5 border-t border-[#E4ECEF] dark:border-[#253741] flex items-start gap-2">
                <Calculator className="w-3.5 h-3.5 text-[#0F6B75] dark:text-[#5DC2CC] shrink-0 mt-0.5" aria-hidden="true" />
                <code className="font-mono text-[12px] text-[#0B4D55] dark:text-[#8CDCE4] leading-snug">
                  {entry.formula}
                </code>
              </div>
            )}

            {entry.trap && (
              <div className="mt-2.5 rounded-lg bg-[#FDF5E8] dark:bg-[#2F2414] border border-[#EFD7AE] dark:border-[#5C431E] px-2.5 py-2 flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B45309] dark:text-[#F5B041] shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-[12px] leading-snug text-[#7C3A08] dark:text-[#F8D093]">
                  <strong className="font-semibold">Klausur-Falle:</strong> {entry.trap}
                </span>
              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
};

interface RichTextProps {
  text: string;
  className?: string;
}

/**
 * Automatically turns any course technical term inside prose into an interactive
 * hover/tap GlossaryTerm tooltip.
 */
export const RichText: React.FC<RichTextProps> = ({ text, className }) => {
  const segments = tokenizeWithGlossary(text);

  return (
    <span className={className}>
      {segments.map((seg, idx) =>
        seg.type === 'term' && seg.entry ? (
          <GlossaryTerm key={`${seg.entry.id}-${idx}`} entry={seg.entry}>
            {seg.content}
          </GlossaryTerm>
        ) : (
          <React.Fragment key={idx}>{seg.content}</React.Fragment>
        )
      )}
    </span>
  );
};
