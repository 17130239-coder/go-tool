export type Role = 'super-admin' | 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
}

export interface Permission {
  key: string;
  label: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type Language = 'en' | 'vi';

export * from './formatter';
