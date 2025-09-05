'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const ToastIcon = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
};

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // 애니메이션을 위해 약간 지연 후 보이기
    const showTimer = setTimeout(() => setIsVisible(true), 50);
    
    // 자동 닫기 타이머
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoCloseTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // 애니메이션 시간
  };

  const Icon = ToastIcon[type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md w-full transition-all duration-300',
        toastStyles[type],
        isVisible && !isLeaving
          ? 'transform translate-x-0 opacity-100'
          : 'transform translate-x-full opacity-0'
      )}
    >
      <Icon className={cn('w-5 h-5 mt-0.5 flex-shrink-0', iconStyles[type])} />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold">{title}</h4>
        {message && (
          <p className="text-xs mt-1 opacity-90">{message}</p>
        )}
      </div>

      <button
        onClick={handleClose}
        className="p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}