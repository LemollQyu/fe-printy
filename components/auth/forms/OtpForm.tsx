"use client";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { Brand, DemoMessage, PrimaryButton, type FormProps } from "./FormParts";

const LENGTH = 5;
const RESEND_SECONDS = 30;

/* ---------- gaya kotak kode (scoped lewat prefix .pb-otp) ----------
   - Wrapper jadi "container", jadi ukuran kotak & huruf mengikuti
     lebar tombol "Verifikasi", bukan lebar layar → rapi di HP maupun desktop.
   - Kotak dibuat dengan aspect-ratio, jadi proporsinya selalu konsisten.
*/
const OTP_CSS = `
.pb-otp-wrap {
  container-type: inline-size;
  width: 100%;
  margin-top: calc(var(--gap, 16px) * 1.2);
}

.pb-otp {
  display: grid;
  grid-template-columns: repeat(${LENGTH}, minmax(0, 1fr));
  gap: clamp(6px, 3.2cqi, 16px);
  width: 100%;
  max-width: 460px;
  margin-inline: auto;
}

.pb-otp-cell {
  position: relative;
  aspect-ratio: 5 / 6;
  min-width: 0;
}

.pb-otp-box {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 2px dashed rgba(92, 78, 58, 0.6);
  border-radius: clamp(8px, 2.4cqi, 14px);
  background: rgba(255, 255, 255, 0.45);
  color: var(--pen, #1c2c58);
  caret-color: transparent;
  font-family: var(--f-hand, inherit);
  font-size: clamp(26px, 10.5cqi, 46px);
  font-weight: 600;
  line-height: 1;
  text-align: center;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    box-shadow 0.18s ease,
    transform 0.18s ease;
}

/* terisi: garis jadi tegas seperti sudah ditulis tinta */
.pb-otp-cell.is-filled .pb-otp-box {
  border-style: solid;
  border-color: var(--pen, #1c2c58);
  background: rgba(255, 255, 255, 0.8);
}

/* aktif: seperti disorot stabilo + cincin halus */
.pb-otp-box:focus {
  border-style: solid;
  border-color: var(--pen, #1c2c58);
  background: rgba(255, 244, 190, 0.75);
  box-shadow:
    0 0 0 3px rgba(28, 44, 88, 0.14),
    0 6px 14px -8px rgba(28, 44, 88, 0.45);
  transform: translateY(-2px);
}

/* kursor tulis: garis kedip di kotak aktif yang masih kosong */
.pb-otp-cell:not(.is-filled)::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 24%;
  bottom: 24%;
  width: 2px;
  margin-left: -1px;
  border-radius: 2px;
  background: var(--pen, #1c2c58);
  opacity: 0;
  pointer-events: none;
}
.pb-otp-cell.is-active:not(.is-filled)::after {
  animation: pb-otp-caret 1.05s steps(1) infinite;
}
@keyframes pb-otp-caret {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 0; }
}

/* error */
.pb-otp.is-error .pb-otp-box {
  border-style: solid;
  border-color: #b3382f;
  background: rgba(179, 56, 47, 0.07);
  color: #b3382f;
}
.pb-otp.is-error .pb-otp-box:focus {
  box-shadow: 0 0 0 3px rgba(179, 56, 47, 0.18);
}
.pb-otp.is-error.is-shake {
  animation: pb-otp-shake 0.38s ease;
}
@keyframes pb-otp-shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(3px); }
}

/* HP kecil */
@container (max-width: 300px) {
  .pb-otp-cell { aspect-ratio: 4 / 5; }
}

@media (prefers-reduced-motion: reduce) {
  .pb-otp-box { transition: none; }
  .pb-otp-box:focus { transform: none; }
  .pb-otp.is-error.is-shake { animation: none; }
  .pb-otp-cell.is-active:not(.is-filled)::after { animation: none; opacity: 0.85; }
}
`;

export default function OtpForm({
  fields,
  errors,
  setField,
  onSubmit,
  message,
  navigate,
}: FormProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [left, setLeft] = useState(RESEND_SECONDS);
  const [focused, setFocused] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const otp = fields.otp ?? "";
  const hasError = Boolean(errors.otp);

  // nilai terbaru, selalu sinkron (dipakai handler agar tidak membaca state lama)
  const valueRef = useRef(otp);
  valueRef.current = otp;
  const commit = (next: string) => {
    valueRef.current = next;
    setField("otp", next);
  };

  // hitung mundur tombol "Kirim ulang"
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  // getar sekali saat error baru muncul
  useEffect(() => {
    if (!errors.otp) return;
    setShake(true);
    const t = setTimeout(() => setShake(false), 400);
    return () => clearTimeout(t);
  }, [errors.otp]);

  const focusBox = (i: number) => {
    const el = inputs.current[Math.max(0, Math.min(i, LENGTH - 1))];
    el?.focus();
    el?.select();
  };

  const handleChange = (i: number, raw: string) => {
    const cur = valueRef.current;
    let chars = raw.replace(/\D/g, "");

    // terhapus lewat keyboard HP: buang digit di kotak ini
    if (!chars) {
      commit(cur.slice(0, i) + cur.slice(i + 1));
      return;
    }

    // ketik 1 digit di kotak yang sudah terisi: ambil digit barunya saja
    if (cur[i] && chars.length === 2) {
      chars = chars.replace(cur[i], "") || chars[0];
    }

    // 1 digit → isi kotak ini, langsung pindah ke kotak berikutnya
    if (chars.length === 1) {
      commit(cur.slice(0, i) + chars + cur.slice(i + 1));
      focusBox(i + 1);
      return;
    }

    // autofill SMS: isi dari kotak ini ke kanan
    const next = (cur.slice(0, i) + chars).slice(0, LENGTH);
    commit(next);
    focusBox(next.length);
  };

  const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!digits) return;
    e.preventDefault();
    const next = (valueRef.current.slice(0, i) + digits).slice(0, LENGTH);
    commit(next);
    focusBox(next.length);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const cur = valueRef.current;
      // kotak berisi → hapus kotak ini; kotak kosong → hapus kotak sebelumnya dan mundur
      const target = cur[i] ? i : Math.max(0, i - 1);
      if (!cur[target]) return;
      commit(cur.slice(0, target) + cur.slice(target + 1));
      focusBox(target);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusBox(i - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      focusBox(i + 1);
    }
  };

  const resend = () => {
    if (left > 0) return;
    // TODO: panggil API kirim ulang kode di sini
    setLeft(RESEND_SECONDS);
    commit("");
    focusBox(0);
  };

  return (
    <div className="pb-formbody pb-formbody--signup pb-formbody--otp">
      <style>{OTP_CSS}</style>
      <div className="pb-tilt">
        <Brand />
        <header className="pb-head">
          <p className="pb-kicker">Pemulihan Akun</p>
          <h1 className="pb-title">Masukkan Kode</h1>
          <p className="pb-lede">
            Kami mengirim 5 digit kode ke{" "}
            <strong>{fields.email || "email Anda"}</strong>.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate>
          <div className="pb-otp-wrap">
            <div
              className={`pb-otp${hasError ? " is-error" : ""}${
                shake ? " is-shake" : ""
              }`}
              role="group"
              aria-label="Kode verifikasi 5 digit"
            >
              {Array.from({ length: LENGTH }, (_, i) => (
                <div
                  key={i}
                  className={`pb-otp-cell${otp[i] ? " is-filled" : ""}${
                    focused === i ? " is-active" : ""
                  }`}
                >
                  <input
                    className="pb-otp-box"
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    aria-label={`Digit ${i + 1} dari ${LENGTH}`}
                    aria-invalid={hasError || undefined}
                    value={otp[i] ?? ""}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={(e) => handlePaste(i, e)}
                    onFocus={() => {
                      setFocused(i);
                      // isi harus berurutan: kotak kosong di depan diprioritaskan
                      const len = valueRef.current.length;
                      if (i > len) focusBox(len);
                      else inputs.current[i]?.select();
                    }}
                    onBlur={() => setFocused((f) => (f === i ? null : f))}
                  />
                </div>
              ))}
            </div>
          </div>

          {errors.otp ? (
            <span className="pb-fld-err" role="alert">
              {errors.otp}
            </span>
          ) : null}

          <PrimaryButton>Verifikasi</PrimaryButton>
        </form>

        <p className="pb-legal">
          Belum menerima kode?{" "}
          <button type="button" onClick={resend} disabled={left > 0}>
            {left > 0 ? `Kirim ulang (${left}d)` : "Kirim ulang"}
          </button>
        </p>
        <p className="pb-legal">
          Salah email?{" "}
          <button type="button" onClick={() => navigate("forgot")}>
            Ubah email
          </button>
        </p>
        <DemoMessage message={message} />
      </div>
    </div>
  );
}
