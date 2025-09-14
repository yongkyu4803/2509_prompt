'use client';

import { useEffect, useRef } from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import noticesData from '@/data/notices.json';

interface AdminNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notice {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  content: string;
  date: string;
}

const notices: Notice[] = noticesData;

const getNoticeIcon = (type: Notice['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    case 'info':
    default:
      return <Info className="w-5 h-5 text-blue-600" />;
  }
};

const getNoticeColorClasses = (type: Notice['type']) => {
  switch (type) {
    case 'success':
      return 'border-green-200 bg-green-50';
    case 'warning':
      return 'border-amber-200 bg-amber-50';
    case 'info':
    default:
      return 'border-blue-200 bg-blue-50';
  }
};

export default function AdminNoticeModal({ isOpen, onClose }: AdminNoticeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ESC 키로 모달 닫기 및 포커스 관리
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // 현재 포커스된 요소 저장
      previousFocusRef.current = document.activeElement as HTMLElement;

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      // 모달에 포커스
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';

      // 이전 포커스된 요소로 복귀
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // cleanup에서는 무조건 스크롤 복원
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                  관리자 공지사항
                </h3>
                <p id="modal-description" className="text-sm text-gray-500">
                  최신 업데이트 및 중요 안내사항
                </p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto p-6">
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className={`border rounded-xl p-4 ${getNoticeColorClasses(notice.type)}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNoticeIcon(notice.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {notice.title}
                        </h4>
                        <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                          {notice.date}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {notice.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              확인
            </button>
          </div>
        </div>
      </div>
  );
}