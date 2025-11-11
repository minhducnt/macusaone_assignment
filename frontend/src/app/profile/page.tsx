'use client';

import { DashboardLayout } from '@/presentation/components/templates/dashboard-layout';
import { Avatar } from '@/presentation/components/atoms/avatar';
import { useAuth } from '@/contexts/auth-context';
import { User, Mail, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Shield;
      case 'manager':
        return User;
      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  return (
    <DashboardLayout title="Profile">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar
              src={user.avatar}
              name={user.name}
              size="xxl"
              className="mx-auto md:mx-0"
            />

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {user.name}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-gray-600 dark:text-gray-400 mb-3">
                    <Mail className="h-5 w-5" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-gray-600 dark:text-gray-400 mb-3">
                    <RoleIcon className="h-5 w-5" />
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
