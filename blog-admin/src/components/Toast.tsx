'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
};

const styles = {
  success: 'bg-white border-l-4 border-green-500 text-gray-900',
  error: 'bg-white border-l-4 border-red-500 text-gray-900',
  warning: 'bg-white border-l-4 border-yellow-500 text-gray-900',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
};

export function Toast({ message, type, onClose }: ToastProps) {
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${styles[type]} animate-slide-up`}>
      <Icon className={`w-5 h-5 ${iconColors[type]}`} />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-black/5 rounded transition-colors">
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

// Toast Hook
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  return { toast, showToast, hideToast };
}
