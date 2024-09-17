import { DocumentResponse, DSM, Message } from './types';
import { BASE_URL } from './config';
import axios, { AxiosInstance, AxiosProgressEvent } from 'axios';

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

export const getDocuments = async(): Promise<DSM[]> => {
  try {
    const response = await api.get<DocumentResponse>('/Document/getDocuments');
    console.log(response.data);
    return response.data.documents.map((doc) => {
      return {
        id: doc.id,
        name: doc.name,
        category: doc.category,
        technology: doc.technology,
        generation: doc.generation,
        function: doc.platform,
      };
    });
  }
  catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
}

export const chatCompletion = async (messages: Message[], onChunk: (chunk: string) => void) => {
  let streamedText = '';
  const token = localStorage.getItem('token');
  
  try {
    await api.post('/ChatBot/completions', {
      model: 'gpt-3.5-turbo',
      messages,
      stream: true
    }, {
      responseType: 'text',
      headers: {
        'Accept': 'text/event-stream',
      },
      onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
        const data = progressEvent.event?.target as XMLHttpRequest;
        if (data?.responseText) {
          const newText = data.responseText.slice(streamedText.length);
          streamedText = data.responseText;
          
          const lines = newText.split('\n');
          const parsedLines = lines
            .map(line => line.replace(/^data: /, '').trim())
            .filter(line => line !== '' && line !== '[DONE]')
            .map(line => {
              try {
                return JSON.parse(line);
              } catch (e) {
                console.error('Error parsing line:', line);
                return null;
              }
            })
            .filter((line): line is NonNullable<typeof line> => line !== null);

          for (const parsed of parsedLines) {
            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta) {
              const content = parsed.choices[0].delta.content || '';
              if (content) {
                onChunk(content);
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error in chatCompletion:', error);
    throw error;
  }
};

const mockMessages: Message[] = [
  {
    content: 'Hello! How can I help you today?',
    role: 'assistant',
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