export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export interface User {
  userId: string | null;
  name: string | null;
  email: string | null;
}