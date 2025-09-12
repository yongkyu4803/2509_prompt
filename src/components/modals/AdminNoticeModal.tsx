'use client';

import { useEffect } from 'react';
import { X, Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';

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

const notices: Notice[] = [
  {
    id: '1',
    type: 'success',
    title: '새로운 카테고리 추가',
    content: `📝 새 카테고리가 추가되었습니다:
• 보도자료: 언론 보도용 콘텐츠 작성
• 이슈분석: 현안 분석 리포트 작성  
• 질의서작성: 공식 문서 및 질의서 작성

더욱 체계적인 프롬프트 관리를 경험해보세요!`,
    date: '2024.01.15'
  },
  {
    id: '2',
    type: 'info',
    title: '시스템 업데이트 안내',
    content: `🔧 시스템 개선사항:
• 검색 성능 향상 (2배 빨라짐)
• 프롬프트 복사 기능 개선
• 모바일 사용성 최적화
• 즐겨찾기 동기화 안정화

업데이트된 기능들을 확인해보세요.`,
    date: '2024.01.10'
  },
  {
    id: '3',
    type: 'warning',
    title: '정기 점검 예정',
    content: `⏰ 정기 시스템 점검 예정:
• 일시: 2024년 1월 20일 (토) 02:00~04:00
• 소요시간: 약 2시간
• 점검내용: 서버 성능 최적화 및 보안 업데이트

점검 시간 동안 서비스 이용이 제한될 수 있습니다.`,
    date: '2024.01.08'
  }
];

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
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  관리자 공지사항
                </h3>
                <p className="text-sm text-gray-500">
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
    </div>
  );
}