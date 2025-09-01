'use client';

import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { cn } from '@/lib/utils';

interface ReadOnlyBadgeProps {
  className?: string;
}

export function ReadOnlyBadge({ className }: ReadOnlyBadgeProps) {
  const { isViewer, roleDisplay } = usePermissions();
  
  if (!isViewer) return null;
  
  return (
    <div className={cn(
      'inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full',
      className
    )}>
      <span>{roleDisplay.icon}</span>
      <span>{roleDisplay.label}</span>
    </div>
  );
}

interface RoleDisplayProps {
  className?: string;
  showDescription?: boolean;
}

export function RoleDisplay({ className, showDescription = false }: RoleDisplayProps) {
  const { roleDisplay, role } = usePermissions();
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn(
        'flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full',
        role === 'admin' 
          ? 'bg-purple-100 text-purple-700' 
          : 'bg-gray-100 text-gray-600'
      )}>
        <span>{roleDisplay.icon}</span>
        <span>{roleDisplay.label}</span>
      </div>
      
      {showDescription && (
        <span className="text-xs text-gray-500">
          {role === 'admin' ? '모든 권한' : '읽기 전용'}
        </span>
      )}
    </div>
  );
}