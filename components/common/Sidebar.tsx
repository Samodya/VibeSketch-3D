
import React from 'react';
import { Page, NavItem } from '../../types';
import { ICONS } from '../../constants';
import Icon from './Icon';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NAV_ITEMS: NavItem[] = [
  { page: Page.Sketch, name: 'Sketch', icon: ICONS.SKETCH },
  { page: Page.Editor, name: 'AI Editor', icon: ICONS.EDITOR },
  { page: Page.Upscale, name: 'Enhance', icon: ICONS.UPSCALE },
  { page: Page.Generator, name: 'Generator', icon: ICONS.GENERATOR },
];

const NavButton: React.FC<{ item: NavItem; isActive: boolean; onClick: () => void; }> = ({ item, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center md:justify-start w-full p-3 my-1 rounded-lg transition-all duration-300 group ${
        isActive
          ? 'bg-cyan-500/20 text-cyan-400'
          : 'text-gray-400 hover:bg-white/10 hover:text-white'
      }`}
      aria-label={item.name}
    >
      <Icon className={`w-6 h-6 ${isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-cyan-400'}`}>{item.icon}</Icon>
      <span className="hidden md:inline ml-4 font-semibold">{item.name}</span>
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 p-4 bg-slate-900/50 border-r border-white/10">
        <div className="flex items-center mb-8">
            <Icon className="w-10 h-10 text-cyan-400">{ICONS.GENERATOR}</Icon>
            <h1 className="text-2xl font-bold ml-2">VibeSketch 3D</h1>
        </div>
        <nav>
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.page}
              item={item}
              isActive={currentPage === item.page}
              onClick={() => setCurrentPage(item.page)}
            />
          ))}
        </nav>
      </aside>
      
      {/* Mobile Top Bar */}
      <nav className="md:hidden flex justify-around p-2 bg-slate-900/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        {NAV_ITEMS.map((item) => (
           <button
             key={item.page}
             onClick={() => setCurrentPage(item.page)}
             className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-300 ${
               currentPage === item.page ? 'text-cyan-400' : 'text-gray-400'
             }`}
             aria-label={item.name}
           >
             <Icon className="w-6 h-6">{item.icon}</Icon>
             <span className="text-xs mt-1">{item.name}</span>
           </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
