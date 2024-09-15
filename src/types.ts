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