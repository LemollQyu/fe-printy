"use client";

import { useEffect, useRef, type ReactNode } from "react";
import "./Botanical.css";
import { createPortal } from "react-dom";

/* Ganti path ini kalau lokasi gambar kamu beda (folder /public) */
const LEAF_TOP_SRC = "/images/auth/leaves-pop-up-top.webp"; // pojok kiri atas
const LEAF_BOTTOM_SRC = "/images/auth/leaves-pop-up-bottom.webp"; // pojok kanan bawah

type BotanicalModalProps = {
  open: boolean;
  onClose: () => void;
  /** Isi modal – bebas kamu isi sendiri */
  children?: ReactNode;
  /** Klik area gelap di luar frame untuk menutup (default: true) */
  closeOnOverlayClick?: boolean;
  /** Tampilkan tombol X (default: true) */
  showCloseButton?: boolean;
  /** Class tambahan (Tailwind dll) untuk wrapper konten, mis. "text-center space-y-4" */
  contentClassName?: string;
  /** Class tambahan untuk frame luar, mis. "max-w-[720px]" untuk ubah lebar */
  className?: string;
  /** Label aksesibilitas dialog */
  ariaLabel?: string;
};

export default function BotanicalModal({
  open,
  onClose,
  children,
  closeOnOverlayClick = true,
  showCloseButton = true,
  contentClassName = "",
  className = "",
  ariaLabel = "Dialog",
}: BotanicalModalProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  // Escape untuk menutup + kunci scroll body saat terbuka
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    frameRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="bm-root bm-overlay"
      onMouseDown={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={frameRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`bm-frame outline-none ${className}`}
      >
        <div className="bm-book">
          {/* tumpukan halaman di belakang */}
          <span className="bm-sheet bm-sheet--3" aria-hidden />
          <span className="bm-sheet bm-sheet--2" aria-hidden />
          <span className="bm-sheet bm-sheet--1" aria-hidden />

          <div className="bm-paper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LEAF_TOP_SRC}
              alt=""
              aria-hidden
              draggable={false}
              className="bm-leaf bm-leaf--top"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LEAF_BOTTOM_SRC}
              alt=""
              aria-hidden
              draggable={false}
              className="bm-leaf bm-leaf--bottom"
            />

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="bm-close"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            )}

            {/* === AREA KOSONG: isi sendiri lewat children === */}
            <div className={`bm-content ${contentClassName}`}>{children}</div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
