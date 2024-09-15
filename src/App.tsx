import React, { useEffect } from "react";
import Sidebar from "./components/Sidebar/Sidebar";
import {
  MessageSquare,
  Bot,
  FileText,
  SquareLibrary,
  Search,
  History,
  HelpCircle,
  Settings,
  Bug,
  Newspaper,
} from "lucide-react";
import SidebarItem from "./components/Sidebar/SidebarItem";
import { checkForUnreadNews } from "./api";
import { PageType, useAppContext } from "./AppContext";

import ChatPage from "./components/Chat/ChatPage";
import AssistantPage from "./components/Assistant/AssistantPage";
import DocumentPage from "./components/Document/DocumentPage";
import LibraryPage from "./components/Library/LibraryPage";
import SearchPage from "./components/Search/SearchPage";
import HistoryPage from "./components/History/HistoryPage";
import SettingsPage from "./components/Settings/SettingsPage";
import HelpPage from "./components/Help/HelpPage";
import IssuePage from "./components/Issue/IssuePage";
import NewsPage from "./components/News/NewsPage";

const App: React.FC = () => {
  const {
    activePage,
    setActivePage,
    hasUnreadNews,
    setHasUnreadNews,
    darkMode,
    user,
    isLoading,
    isAuthenticated,
  } = useAppContext();

  useEffect(() => {
    const checkNews = async () => {
      const hasUnread = await checkForUnreadNews();
      setHasUnreadNews(hasUnread);
    };
    checkNews();
    const interval = setInterval(checkNews, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [setHasUnreadNews]);

  useEffect(() => {
    if (activePage === 'news') {
      setHasUnreadNews(false);
    }
  }, [activePage, setHasUnreadNews]);

  const renderPage = () => {
    switch (activePage) {
      case "chat":
        return <ChatPage />;
      case "assistant":
        return <AssistantPage />;
      case "document":
        return <DocumentPage />;
      case "library":
        return <LibraryPage />;
      case "search":
        return <SearchPage />;
      case "history":
        return <HistoryPage />;
      case "settings":
        return <SettingsPage />;
      case "help":
        return <HelpPage />;
      case "issue":
        return <IssuePage />;
      case "news":
      default:
        return <NewsPage />;
    }
  };

  const sidebarItems: {
    icon: React.ReactNode;
    text: string;
    page: PageType;
  }[] = [
    { icon: <MessageSquare size={20} />, text: "Chat", page: "chat" },
    { icon: <Bot size={20} />, text: "Assistant", page: "assistant" },
    { icon: <FileText size={20} />, text: "Document", page: "document" },
    { icon: <SquareLibrary size={20} />, text: "Library", page: "library" },
    { icon: <Search size={20} />, text: "Search", page: "search" },
    { icon: <History size={20} />, text: "History", page: "history" },
    { icon: <Settings size={20} />, text: "Settings", page: "settings" },
    { icon: <HelpCircle size={20} />, text: "Help", page: "help" },
    { icon: <Bug size={20} />, text: "Issue", page: "issue" },
    { icon: <Newspaper size={20} />, text: "News", page: "news" },
  ];

  if (isLoading) {
    return <div className='flex text-2xl text-black items-center justify-center h-screen w-screen bg-white'>Authenticating...</div>;
  }

  if (!isAuthenticated) {
    return <div className='flex text-2xl text-red-500 items-center justify-center h-screen w-screen bg-white'>Unauthorized to access page.</div>;
  }

  return (
    <main className={`flex h-screen ${darkMode ? "dark" : ""}`}>
      <Sidebar user={user}>
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.text}
            icon={item.icon}
            text={item.text}
            active={activePage === item.page}
            alert={item.page === "news" && hasUnreadNews}
            onClick={() => setActivePage(item.page)}
          />
        ))}
      </Sidebar>
      <div className="flex-grow">{renderPage()}</div>
    </main>
  );
};

export default App;
