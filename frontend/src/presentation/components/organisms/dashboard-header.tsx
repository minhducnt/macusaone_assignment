'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '../atoms/button';
import { Badge } from '../atoms/badge';
import { LogOut, User, Shield, Users, Settings, Menu } from 'lucide-react';

interface DashboardHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backHref?: string;
  backLabel?: string;
}

export function DashboardHeader({
  title = 'Dashboard',
  showBackButton = false,
  backHref = '/dashboard',
  backLabel = 'Back to Dashboard'
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'manager':
        return Users;
      default:
        return User;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive' as const;
      case 'manager':
        return 'secondary' as const;
      default:
        return 'default' as const;
    }
  };

  const RoleIcon = user?.role ? getRoleIcon(user.role) : User;

  return (
    <header className="bg-white dark:bg-gray-800 shadow border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link href={backHref}>
                <Button variant="outline" size="sm">
                  <Menu className="mr-2 h-4 w-4" />
                  {backLabel}
                </Button>
              </Link>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {user && (
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                    <RoleIcon className="mr-1 h-3 w-3" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/profile">
              <Button variant="outline" size="sm">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
