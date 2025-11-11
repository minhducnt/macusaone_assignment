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
import { Loader2, User, Mail, Lock } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const { showLoading, updateToSuccess, updateToError } = useEnhancedToast();
  const { showError } = useErrorToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const loadingToast = showLoading('Creating account...', 'Please wait while we set up your account');

    try {
      await registerUser(data.name, data.email, data.password);
      updateToSuccess(
        'Creating account...',
        'Account created successfully!',
        'Please check your email to verify your account.',
        6000
      );
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error: any) {
      updateToError(
        'Creating account...',
        'Registration Failed',
        'Please try again or contact support if the issue persists.'
      );
      showError('Registration Failed', error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name Field */}
        <FormField
          id="name"
          label="Full Name"
          placeholder="John Doe"
          icon={User}
          iconColor="text-green-500"
          error={errors.name?.message}
          disabled={isLoading}
          {...register('name')}
        />

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
          placeholder="Create a strong password"
          error={errors.password?.message}
          disabled={isLoading}
          {...register('password')}
        />

        {/* Confirm Password Field */}
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          {...register('confirmPassword')}
        />

        {/* Create Account Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <User className="h-5 w-5" />
              <span>Create Account</span>
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
