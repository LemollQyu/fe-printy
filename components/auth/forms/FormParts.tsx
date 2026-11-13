"use client";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { PASSWORD_RULES } from "../auth-data";
import type {
  AuthFields,
  AuthMode,
  FieldErrors,
  FieldName,
} from "../auth-types";

export type FormProps = {
  fields: AuthFields;
  errors: FieldErrors;
  setField: (field: FieldName, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  message: string;
  navigate: (mode: AuthMode) => void;
  onSocial: (provider: "Google") => void;
};

export function Brand() {
  return (
    <div className="pb-mark">
      <img
        src="/logo.svg"
        alt=""
        className="pb-mark-logo"
        draggable={false}
        aria-hidden="true"
      />
      <div>
        <strong>Printy</strong>
        <small>Cetak Semua Ide, Jadi Nyata</small>
      </div>
    </div>
  );
}

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function Field({ id, label, icon: Icon, error, ...input }: FieldProps) {
  return (
    <div className="pb-fld">
      <label htmlFor={id}>{label}</label>
      <div className={`pb-fld-box${error ? " is-error" : ""}`}>
        {Icon ? <Icon aria-hidden="true" /> : null}
        <input
          id={id}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...input}
        />
      </div>
      {error ? (
        <span id={`${id}-error`} className="pb-fld-err" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

type SecretFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  /** Tampilkan ikon gembok (default true; Sign Up memakainya false agar bersih seperti kertas) */
  withIcon?: boolean;
};

export function SecretField({
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
  withIcon = true,
}: SecretFieldProps) {
  const [show, setShow] = useState(false);
  return (
    <div className="pb-fld">
      <label htmlFor={id}>{label}</label>
      <div className={`pb-fld-box${error ? " is-error" : ""}`}>
        {withIcon ? <LockKeyhole aria-hidden="true" /> : null}
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "Masukkan password"}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <button
          type="button"
          className="pb-eye"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        >
          {show ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
        </button>
      </div>
      {error ? (
        <span id={`${id}-error`} className="pb-fld-err" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function PasswordRules({ password }: { password: string }) {
  return (
    <div className="pb-rules" aria-live="polite">
      <span className="pb-panel-icon">
        <ShieldCheck aria-hidden="true" />
      </span>
      <div>
        <strong>Password yang baik sebaiknya:</strong>
        <ul>
          {PASSWORD_RULES.map((rule) => (
            <li
              key={rule.label}
              className={rule.check(password) ? "is-ok" : ""}
            >
              <Check aria-hidden="true" />
              {rule.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Note({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div className="pb-note">
      <span className="pb-panel-icon">
        <Icon aria-hidden="true" />
      </span>
      <p>{children}</p>
    </div>
  );
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button type="submit" className="pb-submit">
      <span>{children}</span>
      <ArrowRight aria-hidden="true" />
    </button>
  );
}

export function SocialButtons({
  onSocial,
  divider,
  label,
}: {
  onSocial: (provider: "Google") => void;
  divider: string;
  label: string;
}) {
  return (
    <>
      <div className="pb-or">
        <span>{divider}</span>
      </div>
      <button
        type="button"
        className="pb-google"
        onClick={() => onSocial("Google")}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
          />
        </svg>
        {label}
      </button>
    </>
  );
}

export function DemoMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="pb-demo-message" role="status">
      {message}
    </div>
  );
}
