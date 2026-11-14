import type { AuthMode } from './auth-types';

/* Hanya mode yang tampil sebagai TAB. OTP sengaja tidak di sini. */
export const AUTH_MODES: { value: AuthMode; label: string; icon: 'user-round' | 'lock-keyhole' | 'key-round'; order: number }[] = [
  { value: 'signup', label: 'Sign Up', icon: 'user-round', order: 1 },
  { value: 'signin', label: 'Sign In', icon: 'lock-keyhole', order: 2 },
  { value: 'forgot', label: 'Forgot Password', icon: 'key-round', order: 3 },
];

/* Mode "langkah" = halaman buku yang bukan tab. Perpindahan dari/ke sini
   selalu satu kali balik lembar (tanpa melewati halaman lain). */
export const STEP_MODES: AuthMode[] = ['otp'];

export const MODE_ORDER: Record<AuthMode, number> = {
  ...AUTH_MODES.reduce((acc, item) => {
    acc[item.value] = item.order;
    return acc;
  }, {} as Record<AuthMode, number>),
  otp: 3.5, // setelah forgot (3): Forgot → OTP
};

export const PASSWORD_RULES = [
  { label: 'Minimal 8 karakter', check: (s: string) => s.length >= 8 },
  { label: 'Mengandung huruf besar', check: (s: string) => /[A-Z]/.test(s) },
  { label: 'Mengandung huruf kecil', check: (s: string) => /[a-z]/.test(s) },
  { label: 'Mengandung angka', check: (s: string) => /\d/.test(s) },
];

export const PAGE_DECOR: Record<AuthMode, {
  rightEyebrow: string;
  rightQuoteTop?: string;
  rightSignature: string[];
  leftDecor: 'signup' | 'signin' | 'forgot' | 'otp';
  rightDecor: 'signup' | 'signin' | 'forgot' | 'otp';
}> = {
  signup: {
    rightEyebrow: 'HALAMAN CATATAN\nUNTUK IDE ANDA',
    rightQuoteTop: 'Biarkan halaman ini menyimpan rencana-rencana terbaikmu.',
    rightSignature: ['Dari Ide,', 'Menuju Karya Nyata.'],
    leftDecor: 'signup',
    rightDecor: 'signup',
  },
  signin: {
    rightEyebrow: 'KEMBALI KE RITME\nKREATIVITAS ANDA',
    rightQuoteTop: 'Kadang yang dibutuhkan hanya satu halaman untuk memulai lagi.',
    rightSignature: ['Selamat Datang,', 'Lanjutkan Karyamu.'],
    leftDecor: 'signin',
    rightDecor: 'signin',
  },
  forgot: {
    rightEyebrow: 'RUANG TENANG\nUNTUK MEMULAI ULANG',
    rightQuoteTop: 'Beri ruang sejenak. Setelah itu, lanjutkan perjalananmu kembali.',
    rightSignature: ['Tarik Nafas,', 'Mulai Lagi.'],
    leftDecor: 'forgot',
    rightDecor: 'forgot',
  },
  otp: {
    rightEyebrow: 'SATU LANGKAH LAGI\nUNTUK PULIH',
    rightQuoteTop: 'Kode kecil ini memastikan halamanmu tetap milikmu seorang.',
    rightSignature: ['Hampir Selesai,', 'Satu Kode Lagi.'],
    leftDecor: 'otp',
    rightDecor: 'otp',
  },
};