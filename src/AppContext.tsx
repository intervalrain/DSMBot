import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from './types'

export type PageType = 'chat' | 'assistant' | 'document' | 'library' | 'search' | 'history' | 'settings' | 'help' | 'issue' | 'news';

interface UserConfig {
  language: string;
  notificationsEnabled: boolean;
  
}

interface AppContextType {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  hasUnreadNews: boolean;
  setHasUnreadNews: (value: boolean) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  userConfig: UserConfig;
  setUserConfig: (config: UserConfig) => void;
  user: User;
  setUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageType>('chat');
  const [hasUnreadNews, setHasUnreadNews] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userConfig, setUserConfig] = useState<UserConfig>({
    language: 'en',
    notificationsEnabled: true,
  });
  const [user, setUser] = useState<User>({
    name: 'Rain Hu',
    email: 'rain_hu@umc.com',
  })

  return (
    <AppContext.Provider value={{
      activePage,
      setActivePage,
      hasUnreadNews,
      setHasUnreadNews,
      darkMode,
      setDarkMode,
      userConfig,
      setUserConfig,
      user,
      setUser,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};