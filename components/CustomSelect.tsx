'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';

type SelectOption = string | { label: string; value: string };

const chamfer = { clipPath: 'polygon(10px 0%, 100% 0%, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0% 100%, 0% 10px)' } as React.CSSProperties;
const chamferInner = { clipPath: 'polygon(9px 0%, 100% 0%, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0% 100%, 0% 9px)' } as React.CSSProperties;

export function CustomSelect({ options, value = '', onChange }: { options: SelectOption[]; value?: string; onChange?: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const normalizedOptions = options.map((option) => typeof option === 'string' ? { label: option, value: option } : option);
  const selectedLabel = normalizedOptions.find((option) => option.value === selected)?.label || selected;

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Node;
      const triggerEl = triggerRef.current;
      const menuEl = document.getElementById('custom-select-menu');
      if (!triggerEl?.contains(target) && !menuEl?.contains(target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => { setSelected(value); }, [value]);

  function handleOpen() {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    setOpen((v) => !v);
  }

  const dropdownStyle: React.CSSProperties = rect
    ? { position: 'fixed', top: rect.bottom + 6, left: rect.left, width: rect.width, zIndex: 9999 }
    : {};

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className="relative flex h-10 w-full items-center justify-between px-4 text-sm font-semibold text-white transition-all duration-300"
        style={chamfer}
      >
        <span className="absolute inset-0 -z-10 bg-[rgba(255,255,255,0.18)]" style={chamfer} />
        <span className="absolute inset-[1px] -z-10 bg-[rgba(6,6,6,0.93)]" style={chamferInner} />
        <span className={selected ? 'text-white' : 'text-white/35'}>{selectedLabel || ''}</span>
        <ChevronDown size={13} className={`text-white/45 transition-transform duration-300 ${open ? 'rotate-180 text-[var(--red-bright)]' : ''}`} />
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div
          id="custom-select-menu"
          className="overflow-hidden border border-white/10 bg-[rgba(8,8,8,0.97)] p-1.5 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_40px_-10px_rgba(220,38,38,0.4)] backdrop-blur-2xl animate-scale-in"
          style={{ ...chamfer, ...dropdownStyle }}
        >
          {normalizedOptions.map((option) => {
            const active = selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => { setSelected(option.value); onChange?.(option.value); setOpen(false); }}
                className="group relative block w-full px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 hover:text-white"
                style={chamfer}
              >
                <span className="absolute inset-0 -z-10 transition-colors duration-200 group-hover:bg-[rgba(220,38,38,0.85)]" style={{ ...chamfer, background: active ? 'rgba(220,38,38,0.85)' : 'transparent' }} />
                <span className="absolute inset-[1px] -z-10 transition-colors duration-200 group-hover:bg-[rgba(50,8,8,0.95)]" style={{ ...chamferInner, background: active ? 'rgba(50,8,8,0.95)' : 'transparent' }} />
                <span className={active ? 'text-white' : 'text-white/70'}>{option.label}</span>
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
