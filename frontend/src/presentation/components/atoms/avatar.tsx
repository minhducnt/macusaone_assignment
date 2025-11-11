'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/utils';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  fallbackClassName?: string;
  showOnlineIndicator?: boolean;
  isOnline?: boolean;
}

const sizeClasses = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-12 w-12 text-lg',
  xxl: 'h-24 w-24 text-2xl',
};

const indicatorSizeClasses = {
  sm: 'h-2 w-2 -bottom-0.5 -right-0.5',
  md: 'h-2.5 w-2.5 -bottom-1 -right-1',
  lg: 'h-3 w-3 -bottom-1 -right-1',
  xl: 'h-3.5 w-3.5 -bottom-1 -right-1',
  xxl: 'h-4 w-4 -bottom-1 -right-1',
};

export function Avatar({
  src,
  name,
  size = 'md',
  className,
  fallbackClassName,
  showOnlineIndicator = false,
  isOnline = false,
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(!!src);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const getRandomColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];

    // Simple hash function to get consistent color for same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const showImage = src && !imageError;
  const showFallback = !showImage || imageError;

  return (
    <div className={cn('relative inline-flex', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full font-medium text-white overflow-hidden',
          sizeClasses[size],
          showFallback && getRandomColor(name || 'User'),
          fallbackClassName
        )}
      >
        {showImage && (
          <>
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
            )}
            <img
              src={src}
              alt={name ? `${name}'s avatar` : 'Avatar'}
              className={cn(
                'h-full w-full object-cover transition-opacity duration-200',
                imageLoading ? 'opacity-0' : 'opacity-100'
              )}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </>
        )}

        {showFallback && (
          <span className="font-semibold">
            {name ? getInitials(name) : <User className="h-4 w-4" />}
          </span>
        )}
      </div>

      {showOnlineIndicator && (
        <div
          className={cn(
            'absolute rounded-full border-2 border-white dark:border-gray-800',
            indicatorSizeClasses[size],
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );
}
