import { Plus_Jakarta_Sans, Fraunces, Caveat } from "next/font/google";
import AuthBook from "./AuthBook";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
  display: "swap",
});

// Judul & teks cetak ala buku
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

// Isian tulisan tangan
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
  display: "swap",
});

export default function AuthScene() {
  return (
    <main
      className={`pb-scene ${jakarta.variable} ${fraunces.variable} ${caveat.variable}`}
    >
      <div className="pb-scene-light" aria-hidden="true" />
      <AuthBook />
    </main>
  );
}
