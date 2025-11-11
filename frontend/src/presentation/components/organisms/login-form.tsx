'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '../atoms/button';
import { useAuth } from '@/contexts/auth-context';
import { useEnhancedToast } from '@/presentation/hooks/use-enhanced-toast';
import { useErrorToast } from '@/hooks/use-error-toast';
import { FormField, PasswordField } from '../molecules';
import { Loader2, Mail, Lock } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { login, isLoading } = useAuth();
  const { showLoading, updateToSuccess, updateToError } = useEnhancedToast();
  const { showError } = useErrorToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const loadingToast = showLoading('Signing in...', 'Please wait while we verify your credentials');

    try {
      await login(data.email, data.password);
      updateToSuccess(
        'Signing in...',
        'Welcome back!',
        'You have been successfully logged in.',
        3000
      );
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (error: any) {
      updateToError(
        'Signing in...',
        'Login Failed',
        'Please check your credentials and try again.'
      );
      showError('Login Failed', error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 ">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <FormField
          id="email"
          label="Email Address"
          placeholder="name@company.com"
          type="email"
          icon={Mail}
          iconColor="text-blue-500"
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        {/* Password Field */}
        <PasswordField
          id="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          disabled={isLoading}
          {...register('password')}
        />


        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Signing In...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Lock className="h-5 w-5" />
              <span>Sign In</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
