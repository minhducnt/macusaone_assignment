'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { cn } from '@/shared/utils';
import { Button } from '../atoms/button';
import { Avatar } from '../atoms/avatar';
import {
  LayoutDashboard,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <div className={cn("flex h-screen w-64 flex-col bg-slate-50 dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700", className)}>
      {/* Logo/Brand */}
      <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">MERN App</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 relative overflow-hidden",
                  isActive && "bg-slate-200 dark:bg-slate-800 text-gray-900 dark:text-white",
                  !isActive && "hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                <div className="absolute inset-0 bg-white/20 dark:bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md" />
                <Icon className="h-5 w-5 relative z-10" />
                <span className="relative z-10">{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Avatar & Menu */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-4 py-3 h-auto hover:bg-slate-200 dark:hover:bg-slate-700 relative overflow-hidden focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
            >
              <div className="absolute inset-0 bg-white/20 dark:bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-none" />
              <div className="flex items-center gap-3 relative z-10">
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  size="md"
                />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name || 'User'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || 'user'}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-1"
            align="start"
            side="right"
            sideOffset={8}
            alignOffset={-40}
          >
            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus:bg-gray-100 dark:focus:bg-gray-700"
              onClick={handleProfileClick}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
            <DropdownMenuItem
              className="flex items-center gap-2 px-2 py-2 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
