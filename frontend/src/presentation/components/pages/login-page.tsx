import Link from 'next/link';
import { LoginForm } from '../organisms/login-form';
import { AuthTemplate } from '../templates/auth-template';

export function LoginPage() {
  const footerContent = (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );

  return (
    <AuthTemplate
      title="Welcome back"
      description="Sign in to your account to continue"
      footerContent={footerContent}
    >
      <LoginForm />
    </AuthTemplate>
  );
}
