"use client";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import AuthTabs from "./AuthTabs";
import AuthBrandPage from "./AuthBrandPage";
import SignUpForm from "./forms/SignUpForm";
import SignInForm from "./forms/SignInForm";
import ForgotPasswordForm from "./forms/ForgotPasswordForm";
import OtpForm from "./forms/OtpForm"; // ← BARU
import {
  MODE_ORDER,
  PAGE_DECOR,
  PASSWORD_RULES,
  STEP_MODES, // ← BARU
  STEP_PARENT,
} from "./auth-data";
import {
  initialFields,
  type AuthFields,
  type AuthMode,
  type FieldErrors,
  type FieldName,
} from "./auth-types";
import Botanical from "@/components/popup/Botanical";
import ResetPasswordForm from "./forms/ResetPasswordForm";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_REGEX = /^\d{5}$/; // ← BARU

type TurnDirection = "forward" | "backward";
type FlipState = {
  direction: TurnDirection;
  serial: number;
  from: AuthMode;
  to: AuthMode;
};
type FormProps = ComponentProps<typeof SignUpForm>;

const TURN_MS = 1100; // durasi satu lembar (dipakai CSS lewat --turn-ms)
const STRIPS = 8; // makin banyak = lengkungan makin halus, tapi makin berat
const LEFT_IMG: Record<AuthMode, string> = {
  signup: "/images/auth/leaves-bottom-left.webp",
  signin: "/images/auth/leaves2-bottom-left.png",
  forgot: "/images/auth/leaves-center.png",
  otp: "/images/auth/leaves-bottom-left.webp", // ← BARU (ganti gambar kalau mau)
  reset: "/images/auth/leaves-bottom-left.webp",
};

/* ---------- Satu halaman penuh (dipakai halaman live DAN muka lembar) ---------- */
function Page({
  side,
  mode,
  formProps,
}: {
  side: "left" | "right";
  mode: AuthMode;
  formProps: FormProps;
}) {
  const decor = PAGE_DECOR[mode];

  if (side === "right") {
    return (
      <div
        className={`pb-paper pb-paper-right pb-paper-right-${decor.rightDecor}`}
      >
        <div className="pb-paper-grain" aria-hidden="true" />
        <AuthBrandPage mode={mode} />
        <div className="pb-gutter pb-gutter-right" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`pb-paper pb-paper-left pb-paper-left-${decor.leftDecor}`}>
      <div className="pb-paper-grain" aria-hidden="true" />
      <img
        src={LEFT_IMG[mode]}
        className={`pb-deco pb-deco-left-${decor.leftDecor}`}
        alt=""
        draggable={false}
        aria-hidden="true"
      />
      <div className="pb-form-scroll">
        <div className="pb-form-transition">
          {mode === "signup" ? (
            <SignUpForm {...formProps} />
          ) : mode === "signin" ? (
            <SignInForm {...formProps} />
          ) : mode === "otp" ? (
            <OtpForm {...formProps} />
          ) : mode === "reset" ? (
            <ResetPasswordForm {...formProps} />
          ) : (
            <ForgotPasswordForm {...formProps} />
          )}
        </div>
      </div>
      <div className="pb-gutter pb-gutter-left" aria-hidden="true" />
    </div>
  );
}

/* ---------- Lembar 3D yang melengkung ---------- */
function Face({
  kind,
  offset,
  children,
}: {
  kind: "front" | "back";
  offset: number;
  children: ReactNode;
}) {
  return (
    <div className={`pb-face pb-face-${kind}`}>
      <div className="pb-leaf-frame">
        <div
          className="pb-leaf-page"
          style={{ transform: `translateX(${(-offset / STRIPS) * 100}%)` }}
        >
          {children}
        </div>
      </div>
      <span className="pb-face-shade" />
    </div>
  );
}

function Leaf({
  direction,
  front,
  back,
}: {
  direction: TurnDirection;
  front: ReactNode;
  back: ReactNode;
}) {
  // k = jarak strip dari engsel (0 = paling dekat spine)
  const strip = (k: number): ReactNode => {
    const p = direction === "forward" ? k : STRIPS - 1 - k; // kolom fisik kiri→kanan
    return (
      <div className="pb-strip" style={{ "--k": k } as CSSProperties}>
        <Face kind="front" offset={p}>
          {front}
        </Face>
        {/* sisi belakang tercermin, jadi kolomnya dibalik */}
        <Face kind="back" offset={STRIPS - 1 - p}>
          {back}
        </Face>
        {k < STRIPS - 1 ? strip(k + 1) : null}
      </div>
    );
  };

  return (
    <div
      className={`pb-flipping-sheet is-${direction}`}
      style={{ "--strips": STRIPS } as CSSProperties}
      aria-hidden="true"
      ref={(el) => el?.setAttribute("inert", "")}
    >
      {strip(0)}
    </div>
  );
}

export default function AuthBook() {
  // Halaman kiri & kanan punya mode sendiri supaya bisa di-swap di waktu berbeda.
  const [leftMode, setLeftMode] = useState<AuthMode>("signup");
  const [rightMode, setRightMode] = useState<AuthMode>("signup");
  const [fields, setFields] = useState<AuthFields>(initialFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");
  const [flip, setFlip] = useState<FlipState | null>(null);
  const [target, setTarget] = useState<AuthMode | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isAnimating = useRef(false);
  const currentMode = useRef<AuthMode>("signup");
  const serial = useRef(0);
  const shouldReduceMotion = useReducedMotion();
  const mode = leftMode; // mode form yang sedang aktif
  const [showSuccessSignup, setShowSuccessSignup] = useState(false);
  const [showSuccessResetPassword, setShowSuccesResetPassword] =
    useState(false);

  useEffect(
    () => () => {
      timer.current.forEach(clearTimeout);
      timer.current = [];
    },
    [],
  );

  const navigate = (next: AuthMode) => {
    if (next === currentMode.current || isAnimating.current) return;
    setErrors({});
    setMessage("");
    setTarget(next);

    // Reduced motion & mobile (single page): ganti langsung tanpa flip.
    const compact =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 899px)").matches;
    if (shouldReduceMotion || compact) {
      currentMode.current = next;
      setLeftMode(next);
      setRightMode(next);
      setTarget(null);
      return;
    }

    isAnimating.current = true;
    const direction: TurnDirection =
      MODE_ORDER[next] > MODE_ORDER[currentMode.current]
        ? "forward"
        : "backward";

    // Halaman langkah dihitung sebagai tab induknya (otp/reset → forgot)
    const fromBase = STEP_PARENT[currentMode.current] ?? currentMode.current;
    const toBase = STEP_PARENT[next] ?? next;

    // Daftar tab saja (tanpa halaman langkah), urut dari kecil ke besar
    const tabs = (Object.entries(MODE_ORDER) as [AuthMode, number][])
      .filter(([id]) => !STEP_MODES.includes(id))
      .sort((a, b) => a[1] - b[1])
      .map(([id]) => id);

    const goingForward = MODE_ORDER[toBase] > MODE_ORDER[fromBase];

    // Tab-tab yang dilewati dari fromBase ke toBase (fromBase tidak ikut dihitung)
    const stops: AuthMode[] = tabs.filter((item) =>
      goingForward
        ? MODE_ORDER[item] > MODE_ORDER[fromBase] &&
          MODE_ORDER[item] <= MODE_ORDER[toBase]
        : MODE_ORDER[item] < MODE_ORDER[fromBase] &&
          MODE_ORDER[item] >= MODE_ORDER[toBase],
    );
    if (!goingForward) stops.reverse();

    // Tujuannya halaman langkah: setelah tab induknya, tambahkan halaman itu
    if (next !== toBase) stops.push(next);

    // Masih dalam satu keluarga (forgot ↔ otp ↔ reset): satu kali balik saja
    if (stops.length === 0) stops.push(next);
    const turnOne = (step: number) => {
      const from = currentMode.current;
      const destination = stops[step];
      setFlip({ direction, serial: ++serial.current, from, to: destination });

      // Halaman yang DITINGGALKAN lembar langsung menampilkan isi barunya (tertutup lembar),
      // halaman yang akan DITIMPA lembar tetap lama sampai lembar mendarat.
      if (direction === "forward") setRightMode(destination);
      else setLeftMode(destination);

      timer.current.push(
        setTimeout(() => {
          currentMode.current = destination;
          if (direction === "forward") setLeftMode(destination);
          else setRightMode(destination);
          setFlip(null);

          if (step + 1 >= stops.length) {
            isAnimating.current = false;
            setTarget(null);
          } else {
            timer.current.push(setTimeout(() => turnOne(step + 1), 60));
          }
        }, TURN_MS),
      );
    };
    turnOne(0);
  };

  const setField = (field: FieldName, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setMessage("");
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: FieldErrors = {};

    // email hanya dicek di signup, signin, dan forgot
    // (OTP dan reset memakai email yang sudah diisi sebelumnya)
    if (
      mode !== "otp" &&
      mode !== "reset" &&
      !EMAIL_REGEX.test(fields.email.trim())
    )
      next.email = "Masukkan alamat email yang valid.";

    if (mode === "signup") {
      if (fields.name.trim().length < 2)
        next.name = "Nama lengkap minimal 2 karakter.";
      if (fields.whatsapp.replace(/\D/g, "").length < 9)
        next.whatsapp = "Nomor WhatsApp belum valid.";
      if (!PASSWORD_RULES.every((rule) => rule.check(fields.password)))
        next.password = "Password belum memenuhi persyaratan.";
      if (fields.confirmPassword !== fields.password || !fields.confirmPassword)
        next.confirmPassword = "Konfirmasi password tidak cocok.";
    }

    if (mode === "signin" && !fields.password)
      next.password = "Password wajib diisi.";

    if (mode === "otp" && !OTP_REGEX.test(fields.otp))
      next.otp = "Masukkan 5 digit kode.";

    if (mode === "reset") {
      if (!PASSWORD_RULES.every((rule) => rule.check(fields.password)))
        next.password = "Password belum memenuhi persyaratan.";
      if (!fields.confirmPassword || fields.confirmPassword !== fields.password)
        next.confirmPassword = "Konfirmasi password tidak cocok.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    if (mode === "signup") {
      // TODO: panggil API daftar di sini, lalu setShowSuccess(true) setelah sukses
      setShowSuccessSignup(true);
    } else if (mode === "forgot") {
      // TODO: panggil API kirim OTP reset di sini. Kalau sukses → pindah ke halaman OTP.
      setField("otp", "");
      navigate("otp");
    } else if (mode === "otp") {
      // TODO: panggil API verifikasi OTP. Kalau sukses → halaman password baru.
      setField("password", "");
      setField("confirmPassword", "");
      navigate("reset");
    } else if (mode === "reset") {
      // TODO: panggil API reset password (bawa token dari verifikasi OTP).
      // Kalau sukses → navigate("signin")
      setShowSuccesResetPassword(true);
      setMessage("Password baru valid. Ini masih demo frontend.");
    } else {
      setMessage("Form valid. Ini masih demo frontend.");
    }
  };

  // halaman OTP bagian dari alur Forgot Password, jadi tab Forgot tetap menyala
  const activeMode = target ?? mode;
  const tabMode: AuthMode =
    activeMode === "otp" || activeMode === "reset" ? "forgot" : activeMode;
  const onSocial = (_provider: "Google") =>
    setMessage(
      "Google belum terhubung. Integrasi OAuth bisa ditambahkan nanti.",
    );
  const props = {
    fields,
    errors,
    setField,
    onSubmit: submit,
    message,
    navigate,
    onSocial,
  };

  return (
    <div className="pb-stage">
      <div className="pb-book-layout">
        <AuthTabs
          mode={tabMode}
          onChange={navigate}
          disabled={Boolean(target)}
        />
        <div
          className="pb-book"
          data-mode={mode}
          data-flipping={flip ? "true" : "false"}
          style={{ "--turn-ms": `${TURN_MS}ms` } as CSSProperties}
        >
          <div className="pb-cover" aria-hidden="true" />
          <div className="pb-edge pb-edge-left" aria-hidden="true" />
          <div className="pb-edge pb-edge-right" aria-hidden="true" />
          <div className="pb-edge pb-edge-bottom" aria-hidden="true" />
          <div
            className="pb-spine-pocket pb-spine-pocket-top"
            aria-hidden="true"
          />
          <div
            className="pb-spine-pocket pb-spine-pocket-bottom"
            aria-hidden="true"
          />

          <Page side="left" mode={leftMode} formProps={props} />
          <Page side="right" mode={rightMode} formProps={props} />

          <div className="pb-spine" aria-hidden="true" />

          {flip ? (
            <Fragment key={flip.serial}>
              <div
                className={`pb-cast pb-cast-left ${flip.direction === "backward" ? "is-lift" : "is-land"}`}
                aria-hidden="true"
              />
              <div
                className={`pb-cast pb-cast-right ${flip.direction === "forward" ? "is-lift" : "is-land"}`}
                aria-hidden="true"
              />
              <Leaf
                direction={flip.direction}
                front={
                  <Page
                    side={flip.direction === "forward" ? "right" : "left"}
                    mode={flip.from}
                    formProps={props}
                  />
                }
                back={
                  <Page
                    side={flip.direction === "forward" ? "left" : "right"}
                    mode={flip.to}
                    formProps={props}
                  />
                }
              />
            </Fragment>
          ) : null}
        </div>
      </div>

      <Botanical
        open={showSuccessSignup}
        onClose={() => setShowSuccessSignup(false)}
        closeOnOverlayClick={false}
        contentClassName="text-center"
      >
        <p>Signup</p>
      </Botanical>
      <Botanical
        open={showSuccessResetPassword}
        onClose={() => setShowSuccesResetPassword(false)}
        closeOnOverlayClick={false}
        contentClassName="text-center"
      >
        <p>Reset</p>
      </Botanical>
    </div>
  );
}
