'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserAvatar } from '@/components/community/user-avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, LogOut, Settings, User as UserIcon, Sun, Moon, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Updated import
import { useSettings } from '@/contexts/SettingsContext';

export default function Navbar() {
  const { user, signOut } = useAuth(); // Using the new useAuth hook
  const { theme, setTheme } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const applyTheme = (themeToApply: 'light' | 'dark') => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(themeToApply);
    };

    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getThemeIcon = () => {
    return theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />;
  };

  const toggleSearch = () => {
    setSearchOpen(!isSearchOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Logo and Search Icon */}
          <div className="flex items-center space-x-2">
            {/* Logo */}
            <Link href="/">
              <Button className="flex items-center">
                <span className="text-xl font-bold">Fortoon</span>
                <img src="/logo.svg" alt="Manga App Logo" className="h-8 w-8" />
              </Button>
            </Link>
          </div>

          {/* Middle Section: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl px-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search manga..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Mobile Search Icon */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSearch}>
            <Search className="h-6 w-6" />
          </Button>

          {/* Right Section: Collapsible menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
              {getThemeIcon()}
            </Button>
            {/* Menu Icon (shows on small screens) */}
            <Button className="md:hidden" onClick={toggleSidebar}>
              <Menu className="h-6 w-6" />
            </Button>
            {/* Normal Links for larger screens */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                // <DropdownMenu>
                //   {/* <DropdownMenuTrigger asChild>
                //     <Button variant="ghost" className="flex items-center space-x-2">
                //       <UserAvatar user={user} size="sm" />
                //       <span>{user.name}</span>
                //     </Button>
                //   </DropdownMenuTrigger> */}
                //   <DropdownMenuContent align="end">
                //     <DropdownMenuItem>
                //       <Link href="/profile" className="flex items-center">
                //         <UserIcon className="mr-2 h-4 w-4" />
                //         Profile
                //       </Link>
                //     </DropdownMenuItem>
                //     <DropdownMenuItem>
                //       <Link href="/settings" className="flex items-center">
                //         <Settings className="mr-2 h-4 w-4" />
                //         Settings
                //       </Link>
                //     </DropdownMenuItem>
                //     <DropdownMenuItem onClick={signOut}>
                //       <LogOut className="mr-2 h-4 w-4" />
                //       Sign Out
                //     </DropdownMenuItem>
                //   </DropdownMenuContent>
                // </DropdownMenu>
                <>
                  <Link href="/profile">
                    <Button variant="ghost">Profile</Button>
                  </Link>
                  <Link href="/settings">
                    <Button>Settings</Button>
                  </Link>
                  <Link href="/community">
                    <Button>Community</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Register</Button>
                  </Link>
                  <Link href="/community">
                    <Button>Community</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Search for Mobile */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 p-4">
          <div className="relative">
          <Button variant="ghost" size="icon" className="top-4 right-4" onClick={toggleSearch}>
              X {/* Close button for the search */}
            </Button>
            <Input
                type="search"
                placeholder="Search manga..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>
        </div>
      )}

      {/* Sidebar for right-side menu */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50">
          <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 p-4 text-gray-900 dark:text-white">
            <Button className="mb-4" onClick={toggleSidebar}>Close</Button>
            <nav>
              <ul>
                {user ? (
                  <>
                    <li><Link href="/profile">Profile</Link></li>
                    <li><Link href="/settings">Settings</Link></li>
                    <li><Button onClick={signOut}>Sign Out</Button></li>
                  </>
                ) : (
                  <>
                    <li><Link href="/login">Login</Link></li>
                    <li><Link href="/register">Register</Link></li>
                    <li><Link href="/community">Community</Link></li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
}
