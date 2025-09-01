'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  label?: string;
  showLabel?: boolean;
}

export function CopyButton({ 
  text, 
  className,
  size = 'md',
  variant = 'default',
  label = '복사',
  showLabel = false
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 방지
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const sizeClasses = {
    sm: 'p-1 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  };

  const variantClasses = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-600',
    outline: 'border border-gray-200 hover:bg-gray-50 text-gray-700',
  };

  const iconSize = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg transition-colors font-medium',
        sizeClasses[size],
        variantClasses[variant],
        copied && 'bg-green-100 text-green-700',
        className
      )}
      title={copied ? '복사됨!' : `${label}하기`}
    >
      {copied ? (
        <Check size={iconSize[size]} />
      ) : (
        <Copy size={iconSize[size]} />
      )}
      
      {showLabel && (
        <span>
          {copied ? '복사됨!' : label}
        </span>
      )}
    </button>
  );
}

// 텍스트와 함께 표시되는 복사 버튼
export function CopyTextButton({ 
  text, 
  displayText, 
  className 
}: { 
  text: string; 
  displayText?: string; 
  className?: string; 
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-sm text-gray-600 truncate">
        {displayText || text}
      </span>
      <CopyButton text={text} size="sm" variant="ghost" />
    </div>
  );
}