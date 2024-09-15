import React, { ReactNode } from "react";
import { User } from "../../types"
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { useAppContext } from "../../AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Avatar from "../icons/Avatar";

interface SidebarProps {
  children: ReactNode;
  user: User;
}

const SidebarContent: React.FC<SidebarProps> = ({ children, user }) => {
  const { expanded, setExpanded } = useSidebar();
  const { activePage, setActivePage, darkMode, setDarkMode } = useAppContext();

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={`${darkMode ? "./logo80d.png" : "./logo80.png"}`}
            className={`rounded-xl overflow-hidden transition-all hover:cursor-pointer ${
              expanded ? "w-48" : "w-0"
            }`}
            alt="Logo"
            onClick={() => setActivePage("news")}
          />
          <button
            onClick={() => setExpanded((expanded) => !expanded)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className="flex-1 px-3">{children}</ul>

        <div className="border-t flex p-3">
          <Avatar name={user.name} className="w-10 h-10" />
          {/* <img src="./profile.png" alt="" className="w-10 h-10 rounded-md" /> */}
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{user.name}</h4>
              <span className="text-xs text-gray-600">
                {user.email}
              </span>
            </div>
            <div className="mr-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={darkMode ? 'dark' : 'light'} onValueChange={(value: string) => {
                    if (value === 'dark' && !darkMode) {
                      setDarkMode(true);
                    } else if (value === 'light' && darkMode) {
                      setDarkMode(false);
                    }
                  }}>
                    <DropdownMenuRadioItem value="light">Dark Mode</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">Light Mode</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ children, user }) => {
  return (
    <SidebarProvider>
      <SidebarContent user={user}>{children}</SidebarContent>
    </SidebarProvider>
  );
};

export default Sidebar;
