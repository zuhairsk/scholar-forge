import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Home, FileText, PlusCircle, BarChart2, Settings, Bell, Search, Menu, X, ShieldAlert } from 'lucide-react';
import { cn } from '@/components/ui/design-system';
import { CURRENT_USER } from '@/lib/mockData';
import { Logo } from '@/components/ui/Logo';

export function AppLayout({ children, role = 'reviewer' }: { children: React.ReactNode, role?: 'author' | 'reviewer' | 'admin' }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getLinks = () => {
    if (role === 'admin') {
      return [
        { href: '/admin', label: 'Dashboard', icon: BarChart2 },
      ];
    }
    if (role === 'author') {
      return [
        { href: '/dashboard/author', label: 'Dashboard', icon: Home },
        { href: '/dashboard/author/submit', label: 'Submit Paper', icon: PlusCircle },
        { href: '/explore', label: 'Explore', icon: Search },
      ];
    }
    return [
      { href: '/dashboard/reviewer', label: 'Dashboard', icon: Home },
      { href: '/dashboard/reviewer/badges', label: 'Badges', icon: ShieldAlert },
      { href: '/leaderboard', label: 'Leaderboard', icon: BarChart2 },
      { href: '/explore', label: 'Explore', icon: Search },
    ];
  };

  const links = getLinks();

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="fixed md:relative z-40 h-screen bg-card border-r border-border flex flex-col transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo compact={!sidebarOpen} showSubtitle={sidebarOpen} />
          </Link>
          <button className="md:hidden text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 flex items-center gap-3 border-b border-border/50">
          <div className="w-10 h-10 rounded-full bg-secondary border border-primary/30 flex items-center justify-center text-primary font-serif">
            {CURRENT_USER.avatar}
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-medium text-sm truncate">{CURRENT_USER.name}</p>
              <p className="text-xs text-primary font-mono capitalize">{role}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = location === link.href;
            return (
              <Link key={link.href} href={link.href} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}>
                <link.icon size={20} className={cn(isActive && "drop-shadow-[0_0_8px_rgba(212,168,67,0.5)]")} />
                {sidebarOpen && <span className="font-medium text-sm">{link.label}</span>}
                {isActive && sidebarOpen && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {sidebarOpen && (
          <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20">
            <p className="text-xs text-primary font-bold mb-1">Upgrade to Pro</p>
            <p className="text-xs text-muted-foreground mb-3">Get detailed AI review insights.</p>
            <button className="w-full py-2 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-semibold rounded-lg transition-colors">
              Upgrade Now
            </button>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground" onClick={() => setSidebarOpen(!sidebarOpen)}>
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

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
