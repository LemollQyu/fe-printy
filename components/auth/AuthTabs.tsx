'use client';
import { KeyRound, LockKeyhole, UserRound } from 'lucide-react';
import { AUTH_MODES } from './auth-data';
import type { AuthMode } from './auth-types';

const ICONS = { 'user-round': UserRound, 'lock-keyhole': LockKeyhole, 'key-round': KeyRound };

export default function AuthTabs({ mode, onChange, disabled = false }: { mode: AuthMode; onChange: (mode: AuthMode) => void; disabled?: boolean }) {
  return (
    <nav className="pb-tabs" aria-label="Navigasi autentikasi">
      {AUTH_MODES.map(({ value, label, icon }) => {
        const Icon = ICONS[icon];
        return (
          <button
            type="button"
            key={value}
            className={`pb-tab${mode === value ? ' is-active' : ''}`}
            aria-current={mode === value ? 'page' : undefined}
            disabled={disabled}
            onClick={() => onChange(value)}
          >
            <span className="pb-tab-pin" aria-hidden="true" />
            <Icon size={18} strokeWidth={1.85} aria-hidden="true" />
            <span>{label}</span>
            <i aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
