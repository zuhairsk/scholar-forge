'use client'

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

export function TopBar() {
  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('toggle-sidebar'));
  };

  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur flex items-center justify-between px-6 z-30 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        <div className="hidden md:flex relative w-64 group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search papers, authors..." 
            className="w-full bg-input/50 border border-border rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative text-muted-foreground hover:text-primary transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
        </button>
      </div>
    </header>
  )
}
