import React from "react";
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

const App: React.FC = () => {
  return (
    <main>
      <div className="flex">
        <Sidebar>
          <SidebarItem icon={<MessageSquare size={20} />} text="Chat" active/>
          <SidebarItem icon={<Bot size={20} />} text="Assistant" />
          <SidebarItem icon={<FileText size={20} />} text="Document" />
          <SidebarItem icon={<SquareLibrary size={20} />} text="Library" />
          <SidebarItem icon={<Search size={20} />} text="Search" />
          <SidebarItem icon={<History size={20} />} text="History" />
          <SidebarItem icon={<Settings size={20} />} text="Settings" />
          <SidebarItem icon={<HelpCircle size={20} />} text="Help" />
          <SidebarItem icon={<Bug size={20} />} text="Issue" />
          <SidebarItem icon={<Newspaper size={20} />} text="News" alert/>
        </Sidebar>
      </div>
    </main>
  );
};

export default App;
