"use client";
import { Mail, Phone, UserRound } from "lucide-react";
import {
  Brand,
  DemoMessage,
  Field,
  PrimaryButton,
  SecretField,
  SocialButtons,
  type FormProps,
} from "./FormParts";

export default function SignUpForm({
  fields,
  errors,
  setField,
  onSubmit,
  message,
  onSocial,
}: FormProps) {
  return (
    <div className="pb-formbody pb-formbody--signup">
      <div className="pb-tilt">
        <Brand />
        <header className="pb-head">
          <p className="pb-kicker">Buat Akun</p>
          <h1 className="pb-title">Mulai Bersama Printy</h1>
        </header>

        <form onSubmit={onSubmit} noValidate>
          <div className="pb-stack">
            <Field
              id="name"
              label="Nama Lengkap"
              value={fields.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Nama lengkap Anda"
              autoComplete="name"
              error={errors.name}
              required
            />
            <div className="pb-row">
              <Field
                id="email"
                label="Email"
                type="email"
                value={fields.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="nama@email.com"
                autoComplete="email"
                error={errors.email}
                required
              />
              <Field
                id="whatsapp"
                label="WhatsApp"
                type="tel"
                value={fields.whatsapp}
                onChange={(e) => setField("whatsapp", e.target.value)}
                placeholder="08xxxxxxxxxx"
                autoComplete="tel"
                error={errors.whatsapp}
                required
              />
            </div>
            <div className="pb-row">
              <SecretField
                id="password"
                label="Password"
                placeholder="Buat password"
                value={fields.password}
                onChange={(v) => setField("password", v)}
                error={errors.password}
                autoComplete="new-password"
              />
              <SecretField
                id="confirmPassword"
                label="Konfirmasi"
                placeholder="Ulangi password"
                value={fields.confirmPassword}
                onChange={(v) => setField("confirmPassword", v)}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
            </div>
          </div>
          <PrimaryButton>Buat Akun</PrimaryButton>
        </form>

        <SocialButtons
          onSocial={onSocial}
          divider="atau"
          label="Lanjut dengan Google"
        />
        <p className="pb-legal">
          Dengan mendaftar, Anda menyetujui <a href="/terms">Syarat</a> dan{" "}
          <a href="/privacy">Privasi</a> Printy.
        </p>
        <DemoMessage message={message} />
      </div>
    </div>
  );
}
