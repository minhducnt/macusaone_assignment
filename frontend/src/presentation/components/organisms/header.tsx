'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/shared/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  className?: string;
  title?: string;
  children?: React.ReactNode;
}

export function Header({ className, title, children }: HeaderProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';

    for (const segment of segments) {
      currentPath += `/${segment}`;

      // Format segment label
      let label = segment;
      if (segment === 'dashboard') {
        label = 'Dashboard';
      } else if (segment === 'user') {
        label = 'User Management';
      } else if (segment === 'admin') {
        label = 'Admin';
      } else if (segment === 'manager') {
        label = 'Manager';
      } else if (segment === 'profile') {
        label = 'Profile';
      } else {
        // Capitalize and replace hyphens with spaces
        label = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      breadcrumbs.push({
        label,
        href: currentPath
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className={cn("bg-slate-50 dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 h-16 flex items-center", className)}>
      <div className="flex items-center justify-between w-full">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href || crumb.label}>
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className={cn(
                    "flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors",
                    index === breadcrumbs.length - 1
                      ? "text-gray-900 dark:text-white font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {index === 0 && <Home className="h-4 w-4" />}
                  <span>{crumb.label}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-1 text-gray-900 dark:text-white font-medium">
                  {index === 0 && <Home className="h-4 w-4" />}
                  <span>{crumb.label}</span>
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
    </header>
  );
}
