import { Message } from './types';

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
];

export const fetchChatMessages = async (): Promise<Message[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockMessages;
};

export const sendMessage = async (content: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `You said: "${content}". This is a mock response from the chatbot.`;
};

export const checkForUnreadNews = async (): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Math.random() < 0.5;
}