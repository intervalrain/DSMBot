import { Message } from './types';
import { BASE_URL } from './config';
import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300, // default status checking function
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export interface TokenResponse {
  userId: string,
  userName: string,
  token: string,
  email: string,
  expireTime: Date,
}

export const authenticate = async ():Promise<TokenResponse> => {
  try {
    const response = await api.get<TokenResponse>('/Auth/login');
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('tokenExpireTime', response.data.expireTime.toString());
    localStorage.setItem('userId', response.data.userId);
    localStorage.setItem('userName', response.data.userName);
    localStorage.setItem('email', response.data.email);
    return response.data;
  } catch (error) {
    console.error('Error authenticating:', error);
    throw error;
  }
};

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