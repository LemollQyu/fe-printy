import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const suo = localFont({
  src: "../public/fonts/suo-4.woff2",
  variable: "--font-suo-src",
});

const synt = localFont({
  src: "../public/fonts/synt-4.woff2",
  variable: "--font-synt-src",
});

const feat = localFont({
  src: "../public/fonts/feat-4.woff2",
  variable: "--font-feat-src",
});

export const metadata: Metadata = {
  title: "Printy",
  description: "Cetak Semua Ide, Jadi Nyata",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${suo.variable} ${synt.variable} ${feat.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
