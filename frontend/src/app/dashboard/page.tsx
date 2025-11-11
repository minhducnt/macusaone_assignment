'use client';

import { DashboardLayout } from '@/presentation/components/templates/dashboard-layout';
import { StatCard } from '@/presentation/components/molecules/stat-card';
import { TrendChart, ComparisonChart, DistributionChart, generateTrendData, generateComparisonData, generateDistributionData } from '@/presentation/components/organisms/charts';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/atoms/badge';
import { Users, Activity, DollarSign, TrendingUp, User, Shield, Clock, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

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

  const RoleIcon = getRoleIcon(user.role);

  // Fake metrics data
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      description: 'Active users in the system',
      icon: Users,
      trend: { value: 12.5, label: 'from last month', isPositive: true },
      variant: 'default' as const,
    },
    {
      title: 'Active Sessions',
      value: '1,234',
      description: 'Currently online users',
      icon: Activity,
      trend: { value: 8.2, label: 'from yesterday', isPositive: true },
      variant: 'success' as const,
    },
    {
      title: 'Revenue',
      value: '$45,678',
      description: 'Monthly recurring revenue',
      icon: DollarSign,
      trend: { value: -2.1, label: 'from last month', isPositive: false },
      variant: 'warning' as const,
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      description: 'User conversion rate',
      icon: TrendingUp,
      trend: { value: 15.3, label: 'from last quarter', isPositive: true },
      variant: 'default' as const,
    },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Welcome back, {user.name}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your account today.
              </p>
            </div>
              <div className="flex items-center gap-4">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  <RoleIcon className="mr-1 h-4 w-4" />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                  <span className="text-sm">Last login: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'First time'}</span>
              </div>
            </div>
          </div>
                </div>

        {/* Upcoming Features */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Exciting Features Coming Soon
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We're working on amazing new features to enhance your experience. Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
    </div>
    </DashboardLayout>
  );
}
