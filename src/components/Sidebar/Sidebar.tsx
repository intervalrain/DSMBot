import React, { ReactNode } from "react";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { SidebarProvider, useSidebar } from "./SidebarContext";

interface SidebarProps {
  children: ReactNode;
}

const SidebarContent: React.FC<SidebarProps> = ({ children }) => {
  const { expanded, setExpanded } = useSidebar();

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="./logo80.png"
            className={`rounded-xl overflow-hidden transition-all ${
              expanded ? "w-48" : "w-0"
            }`}
            alt=""
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
          <img src="./profile.png" alt="" className="w-10 h-10 rounded-md" />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Rain Hu</h4>
              <span className="text-xs text-gray-600">
                intervalrain@gmail.com
              </span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <SidebarContent>{children}</SidebarContent>
    </SidebarProvider>
  );
};

export default Sidebar;
