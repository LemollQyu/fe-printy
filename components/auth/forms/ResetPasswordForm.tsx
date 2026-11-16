"use client";
import {
  Brand,
  DemoMessage,
  PrimaryButton,
  SecretField,
  type FormProps,
} from "./FormParts";
import { PASSWORD_RULES } from "../auth-data";

export default function ResetPasswordForm({
  fields,
  errors,
  setField,
  onSubmit,
  message,
  navigate,
}: FormProps) {
  return (
    <div className="pb-formbody pb-formbody--signup pb-formbody--reset">
      <div className="pb-tilt">
        <Brand />
        <header className="pb-head">
          <p className="pb-kicker">Pemulihan Akun</p>
          <h1 className="pb-title">Buat Password Baru</h1>
        </header>

        <form onSubmit={onSubmit} noValidate>
          <div className="pb-stack">
            <SecretField
              id="password"
              label="Password Baru"
              placeholder="Buat password baru"
              value={fields.password}
              onChange={(v) => setField("password", v)}
              error={errors.password}
              autoComplete="new-password"
            />
            <SecretField
              id="confirmPassword"
              label="Konfirmasi Password"
              placeholder="Ulangi password baru"
              value={fields.confirmPassword}
              onChange={(v) => setField("confirmPassword", v)}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          </div>

          <PrimaryButton>Simpan Password</PrimaryButton>
        </form>

        <p className="pb-legal">
          Kode salah?{" "}
          <button type="button" onClick={() => navigate("otp")}>
            Kembali
          </button>
        </p>
        <DemoMessage message={message} />
      </div>
    </div>
  );
}
