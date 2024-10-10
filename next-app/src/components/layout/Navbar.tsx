'use client';

import { useState } from 'react';
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
import { Search, Menu, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; 
export default function Navbar() {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - User info or Login/Register */}
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Button>
              <span className="text-xl font-bold">Fortoon</span>
            <img 
              src="/logo.svg" 
              alt="Fortoon Logo"
              className="h-8 w-8"
            />
              </Button>
            </Link>
          </div>

          {/* Middle section - Search bar */}
          <div className="flex-1 max-w-2xl px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Right section - Logo and website name */}
          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <UserAvatar user={user} size="sm" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <Link href="/profile" className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
                <Link href="/community">
                  <Button>Community</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}