import Link from 'next/link';
import { RegisterForm } from '../organisms/register-form';
import { AuthTemplate } from '../templates/auth-template';

export function RegisterPage() {
  const footerContent = (
     <div className="mt-6 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );

  return (
    <AuthTemplate
      title="Sign up"
      description="Create your account to start your journey today"
      footerContent={footerContent}
    >
      <RegisterForm />
    </AuthTemplate>
  );
}
