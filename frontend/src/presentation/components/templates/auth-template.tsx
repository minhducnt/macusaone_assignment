import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/card';

interface AuthTemplateProps {
  title: string;
  description?: string;
  children: ReactNode;
  headerContent?: ReactNode;
  footerContent?: ReactNode;
}

export function AuthTemplate({
  title,
  description,
  children,
  headerContent,
  footerContent
}: AuthTemplateProps) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Custom Header Content (for register page) */}
        {headerContent}

        {/* Auth Card */}
        <div className="mt-8">
          <Card className="shadow-lg border-0 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-center">{title}</CardTitle>
              {description && (
                <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
                  {description}
                </p>
              )}
            </CardHeader>

            <CardContent>
              {children}

              {/* Footer Content */}
              {footerContent}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
