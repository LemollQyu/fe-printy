"use client";
import {
  Brand,
  DemoMessage,
  Field,
  PrimaryButton,
  SecretField,
  SocialButtons,
  type FormProps,
} from "./FormParts";

export default function SignInForm({
  fields,
  errors,
  setField,
  onSubmit,
  message,
  navigate,
  onSocial,
}: FormProps) {
  return (
    <div className="pb-formbody pb-formbody--signup pb-formbody--signin">
      <div className="pb-tilt">
        <Brand />
        <header className="pb-head">
          <p className="pb-kicker">Selamat Datang Kembali</p>
          <h1 className="pb-title">Masuk ke Printy</h1>
          <p className="pb-lede">
            Masuk kembali untuk melanjutkan pesanan dan karya Anda.
          </p>
        </header>

        <form noValidate onSubmit={onSubmit}>
          <div className="pb-stack">
            <Field
              id="email"
              label="Email"
              type="email"
              placeholder="nama@email.com"
              value={fields.email}
              onChange={(e) => setField("email", e.target.value)}
              autoComplete="email"
              error={errors.email}
              required
            />
            <SecretField
              id="password"
              label="Password"
              withIcon={false}
              placeholder="Masukkan password Anda"
              value={fields.password}
              onChange={(v) => setField("password", v)}
              autoComplete="current-password"
              error={errors.password}
            />
          </div>
          <div className="pb-tools">
            <button type="button" onClick={() => navigate("forgot")}>
              Lupa password?
            </button>
          </div>
          <PrimaryButton>Masuk Sekarang</PrimaryButton>
        </form>

        <SocialButtons
          onSocial={onSocial}
          divider="atau masuk dengan"
          label="Masuk dengan Google"
        />
        <p className="pb-legal">
          Belum punya akun?{" "}
          <button type="button" onClick={() => navigate("signup")}>
            Daftar sekarang
          </button>
        </p>
        <DemoMessage message={message} />
      </div>
    </div>
  );
}
