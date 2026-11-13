import type { AuthMode } from './auth-types';

export const AUTH_MODES: { value: AuthMode; label: string; icon: 'user-round' | 'lock-keyhole' | 'key-round'; order: number }[] = [
  { value: 'signup', label: 'Sign Up', icon: 'user-round', order: 1 },
  { value: 'signin', label: 'Sign In', icon: 'lock-keyhole', order: 2 },
  { value: 'forgot', label: 'Forgot Password', icon: 'key-round', order: 3 },
];

export const MODE_ORDER: Record<AuthMode, number> = AUTH_MODES.reduce((acc, item) => {
  acc[item.value] = item.order;
  return acc;
}, {} as Record<AuthMode, number>);

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
  leftDecor: 'signup' | 'signin' | 'forgot';
  rightDecor: 'signup' | 'signin' | 'forgot';
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
};
