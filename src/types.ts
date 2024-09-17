export interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface User {
  userId: string | null;
  name: string | null;
  email: string | null;
}

export interface DSM {
  id: string;
  name: string;
  category: string;
  technology: string;
  generation: string;
  function: string;
}

export interface Document {
  id: string;
  name: string;
  generation: string;
  technology: string;
  category: string;
  platform: string;
  revisionVersion: string;
  customMark: string | null;
}

export interface DocumentResponse {
  documents: Document[];
}

export interface UserConfig {
  language: string;
  notificationsEnabled: boolean;
}

export interface AppSettings {
  temperature: number;
  model: string;
  language: string;
  historyDays: number;
  theme: "system" | "dark" | "light";
}
