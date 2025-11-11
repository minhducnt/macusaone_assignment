'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card';
import { Badge } from '@/components/atoms/badge';
import { useAuth } from '@/contexts/auth-context';
import { Shield, Users, User, Settings, FileText, BarChart3 } from 'lucide-react';

// This would be a server component in a real implementation
// For now, it's a client component for compatibility

interface RoleDashboardProps {
  params: Promise<{
    role: string;
  }>;
}

const roleConfigs = {
  admin: {
    title: 'Admin Dashboard',
    description: 'Full system administration and management',
    icon: Shield,
    color: 'destructive',
    features: [
      { title: 'User Management', description: 'Manage all system users', icon: Users },
      { title: 'System Settings', description: 'Configure system-wide settings', icon: Settings },
      { title: 'Analytics', description: 'View system analytics and reports', icon: BarChart3 },
      { title: 'Security Logs', description: 'Monitor security events', icon: FileText },
    ]
  },
  manager: {
    title: 'Manager Dashboard',
    description: 'Team management and oversight',
    icon: Users,
    color: 'secondary',
    features: [
      { title: 'Team Management', description: 'Manage your team members', icon: Users },
      { title: 'Reports', description: 'View team performance reports', icon: BarChart3 },
      { title: 'Settings', description: 'Team-specific settings', icon: Settings },
    ]
  },
  staff: {
    title: 'Staff Dashboard',
    description: 'Your personal workspace and tasks',
    icon: User,
    color: 'default',
    features: [
      { title: 'My Tasks', description: 'View and manage your tasks', icon: FileText },
      { title: 'Profile', description: 'Manage your profile settings', icon: User },
    ]
  }
};

export default function RoleDashboard({ params }: RoleDashboardProps) {
  const { user } = useAuth();
  const [role, setRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setRole(resolvedParams.role);
      setIsLoading(false);
    };

    getParams();
  }, [params]);

  useEffect(() => {
    if (!isLoading && !roleConfigs[role as keyof typeof roleConfigs]) {
      redirect('/dashboard');
    }
  }, [role, isLoading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      redirect('/login');
    }
  }, [user, isLoading]);

  if (isLoading || !role) {
    return <div>Loading...</div>;
  }

  const config = roleConfigs[role as keyof typeof roleConfigs];
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">{config.title}</h1>
              <Badge variant={config.color as any} className="capitalize">
                <IconComponent className="mr-1 h-3 w-3" />
                {role}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="h-6 w-6" />
                Welcome to {config.title}
              </CardTitle>
              <CardDescription>
                {config.description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {config.features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <feature.icon className="h-5 w-5" />
                    {feature.title}
                  </CardTitle>
                  <CardDescription>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors">
                    Access {feature.title}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Role-specific content */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Role Information</CardTitle>
                <CardDescription>
                  Your current permissions and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Current Role
                    </h4>
                    <p className="mt-1 text-lg font-semibold capitalize">{role}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Access Level
                    </h4>
                    <p className="mt-1 text-lg font-semibold">
                      {role === 'admin' ? 'Full Access' : role === 'manager' ? 'Team Access' : 'Basic Access'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Note: generateStaticParams is not available in client components
// This page will be dynamically rendered
