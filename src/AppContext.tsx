import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User } from "./types";
import { authenticate, TokenResponse } from "./api";

export type PageType =
  | "chat"
  | "assistant"
  | "document"
  | "library"
  | "search"
  | "history"
  | "settings"
  | "help"
  | "issue"
  | "news";

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
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activePage, setActivePage] = useState<PageType>("chat");
  const [hasUnreadNews, setHasUnreadNews] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userConfig, setUserConfig] = useState<UserConfig>({
    language: "en",
    notificationsEnabled: true,
  });
  const [user, setUser] = useState<User>({
    userId: null,
    name: null,
    email: null,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      const tokenExpireTime = localStorage.getItem("tokenExpireTime");

      if (token && tokenExpireTime) {
        if (new Date(tokenExpireTime) > new Date()) {
          setIsAuthenticated(true);
          setIsLoading(false);
          const userId = localStorage.getItem("userId");
          const userName = localStorage.getItem("userName");
          const email = localStorage.getItem("email");
          setUser({ userId: userId, name: userName, email: email });
          return;
        }
      }

      try {
        setIsLoading(true);
        const tokenResponse: TokenResponse = await authenticate();
        setUser({ userId: tokenResponse.userId, name: tokenResponse.userName, email: tokenResponse.email });
        setIsAuthenticated(true);
      } catch (error) {
        console.error("An error occurred during authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <AppContext.Provider
      value={{
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
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
