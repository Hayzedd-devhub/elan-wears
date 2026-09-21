'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpDown, Check } from 'lucide-react';

export type SortOption = 'latest' | 'price-asc' | 'price-desc' | 'popular';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Favourited' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function updatePosition() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setMenuPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }

    updatePosition();

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setIsOpen(false);
    }

    // The trigger sits inside a container whose height animates on scroll
    // (see Header's auto-hide row), so any scroll or resize can move the
    // button out from under a fixed-position menu — just close it.
    function handleDismiss() {
      setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleDismiss, true);
    window.addEventListener('resize', handleDismiss);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleDismiss, true);
      window.removeEventListener('resize', handleDismiss);
    };
  }, [isOpen]);

  const activeLabel = SORT_OPTIONS.find((option) => option.value === value)?.label;

  return (
    <div className="shrink-0">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap bg-white dark:bg-chocolate-light/10 text-chocolate dark:text-gold-light border border-gray-200 dark:border-gold/20 hover:border-gold/50 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <ArrowUpDown className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Sort:</span> {activeLabel}
      </button>

      {isOpen &&
        menuPosition &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{ top: menuPosition.top, right: menuPosition.right }}
            className="fixed w-52 py-1.5 bg-white dark:bg-chocolate-light rounded-xl shadow-lg border border-gray-100 dark:border-gold/10 z-[100]"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm text-left text-chocolate dark:text-gold-light hover:bg-gray-50 dark:hover:bg-gold/10 transition-colors"
              >
                {option.label}
                {option.value === value && <Check className="w-4 h-4 text-gold" />}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
