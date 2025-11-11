'use client';

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '../organisms/sidebar';
import { Header } from '../organisms/header';
import { Loader2 } from 'lucide-react';
import * as ScrollArea from '@radix-ui/react-scroll-area';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  headerActions?: React.ReactNode;
}

export function DashboardLayout({ children, title, headerActions }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Fixed Sidebar - Full Height */}
      <div className="fixed left-0 top-0 z-40">
        <Sidebar />
      </div>

      {/* Fixed Header */}
      <div className="fixed left-64 top-0 right-0 z-30">
        <Header title={title}>
          {headerActions}
        </Header>
      </div>

      {/* Main Content Area with Left Margin for Fixed Sidebar and Top Margin for Fixed Header */}
      <div className="ml-64 mt-16 flex flex-col min-h-screen">
        {/* Page Content with Scroll Area */}
        <ScrollArea.Root className="flex-1">
          <ScrollArea.Viewport className="h-full">
            <main className="p-6">
              {children}
            </main>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical" className="flex select-none touch-none p-0.5 bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 w-2.5">
            <ScrollArea.Thumb className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full relative" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </div>
    </div>
  );
}
