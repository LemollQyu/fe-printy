"use client";
import {
  Brand,
  DemoMessage,
  Field,
  PrimaryButton,
  type FormProps,
} from "./FormParts";

export default function ForgotPasswordForm({
  fields,
  errors,
  setField,
  onSubmit,
  message,
  navigate,
}: FormProps) {
  return (
    <div className="pb-formbody pb-formbody--signup pb-formbody--forgot">
      <div className="pb-tilt">
        <Brand />
        <header className="pb-head">
          <p className="pb-kicker">Pemulihan Akun</p>
          <h1 className="pb-title">Lupa Password?</h1>
          <p className="pb-lede">
            Masukkan email yang terdaftar, lalu lanjutkan proses pemulihan akun
            Anda.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate>
          <div className="pb-stack">
            <Field
              id="email"
              label="Alamat Email"
              type="email"
              placeholder="nama@email.com"
              value={fields.email}
              onChange={(e) => setField("email", e.target.value)}
              autoComplete="email"
              error={errors.email}
              required
            />
          </div>

          <PrimaryButton>Kirim Link Reset</PrimaryButton>
        </form>

        <p className="pb-legal">
          Sudah ingat password?{" "}
          <button type="button" onClick={() => navigate("signin")}>
            Kembali ke Sign In
          </button>
        </p>
        <DemoMessage message={message} />
      </div>
    </div>
  );
}
