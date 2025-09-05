'use client';

import { useState } from 'react';
import { Bell, Lightbulb, ChevronUp, ChevronDown } from 'lucide-react';

interface NoticeCard {
  id: string;
  type: 'usage' | 'admin';
  title: string;
  content: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

const noticeCards: NoticeCard[] = [
  {
    id: 'usage-guide',
    type: 'usage',
    title: '프롬프트 사용법 가이드',
    content: `효과적인 프롬프트 활용 방법:

• 기본 프롬프트 선택 → 세부사항 추가
• 구체적인 요구사항과 맥락 포함
• 예시 제공으로 더 정확한 결과 획득
• 복잡한 작업은 단계별 조합 활용`,
    icon: <Lightbulb className="w-5 h-5" />,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800'
  },
  {
    id: 'admin-notice',
    type: 'admin',
    title: '관리자 공지사항',
    content: '📝 새 카테고리:\n• 보도자료: 언론 보도용 콘텐츠\n• 이슈분석: 현안 분석 리포트\n• 질의서작성: 공식 문서 작성\n\n더욱 체계적인 프롬프트 관리를 경험해보세요!',
    icon: <Bell className="w-5 h-5" />,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800'
  }
];

export default function NoticeCards() {
  const [collapsedCards, setCollapsedCards] = useState<string[]>([]);

  const visibleCards = noticeCards.filter(card => 
    card.type === 'usage' || (card.type === 'admin' && card.content.trim() !== '')
  );

  const handleToggle = (cardId: string) => {
    setCollapsedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId]
    );
  };

  if (visibleCards.length === 0) return null;

  return (
    <div className="px-6 pt-6 pb-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {visibleCards.map((card) => {
        const isCollapsed = collapsedCards.includes(card.id);
        
        return (
          <div
            key={card.id}
            className={`
              ${card.bgColor} ${card.borderColor} ${card.textColor}
              border rounded-xl shadow-sm transition-all duration-200 h-fit
            `}
          >
            {/* Header - always visible */}
            <div className={`p-4 ${isCollapsed ? 'pb-4' : 'pb-0'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={`
                    flex-shrink-0 p-2 rounded-lg
                    ${card.type === 'usage' ? 'bg-blue-100' : 'bg-amber-100'}
                  `}>
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {card.title}
                    {card.type === 'admin' && (
                      <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded-full">
                        공지
                      </span>
                    )}
                  </h3>
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => handleToggle(card.id)}
                  className={`
                    flex-shrink-0 p-2 rounded-full hover:bg-opacity-80 transition-colors
                    ${card.type === 'usage' ? 'hover:bg-blue-200' : 'hover:bg-amber-200'}
                  `}
                  title={isCollapsed ? '펼치기' : '접기'}
                >
                  {isCollapsed ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronUp className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Content - collapsible */}
            {!isCollapsed && (
              <div className="px-4 pb-4">
                <div className="pl-14"> {/* Align with title */}
                  {card.content && (
                    <div className="text-sm leading-relaxed whitespace-pre-line mt-3">
                      {card.content}
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}