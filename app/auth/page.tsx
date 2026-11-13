import type { Metadata } from 'next';
import AuthScene from '@/components/auth/AuthScene';
import '@/components/auth/auth-book.css';

export const metadata: Metadata = {
  title: 'Masuk & Daftar | Printy',
  description: 'Mulai perjalanan kreatif Anda bersama Printy.',
};

export default function AuthPage() {
  return <AuthScene />;
}
