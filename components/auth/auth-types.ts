export type AuthMode = 'signup' | 'signin' | 'forgot' | 'otp' | 'reset';
export type AuthFields = {
  name: string;
  email: string;
  whatsapp: string;
  password: string;
  confirmPassword: string;
  otp: string;
};
export type FieldName = keyof AuthFields;
export type FieldErrors = Partial<Record<FieldName, string>>;
export const initialFields: AuthFields = { name: '', email: '', whatsapp: '', password: '', confirmPassword: '' ,otp: ''};
