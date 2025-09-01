'use client';

import { useState, useEffect } from 'react';
import { TableOfContentsItem } from '@/types/study';
import { List, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  activeId?: string;
}

export default function TableOfContents({ items, activeId }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [currentActiveId, setCurrentActiveId] = useState(activeId);

  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map(item => document.getElementById(item.id)).filter(Boolean);
      
      // 현재 뷰포트에서 가장 가까운 제목 찾기
      let currentId = '';
      for (const heading of headings) {
        if (heading) {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100) { // 100px 오프셋
            currentId = heading.id;
          } else {
            break;
          }
        }
      }
      
      setCurrentActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 실행
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // 고정 헤더 높이 고려
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <List size={18} className="text-purple-600" />
          <span className="font-semibold text-gray-900">목차</span>
          <span className="text-sm text-gray-500">({items.length})</span>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>

      {/* 목차 리스트 */}
      {isOpen && (
        <div className="border-t border-gray-100 max-h-80 overflow-y-auto">
          <nav className="p-2">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      'hover:bg-purple-50 hover:text-purple-700',
                      currentActiveId === item.id
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-700'
                    )}
                    style={{
                      paddingLeft: `${8 + (item.level - 1) * 16}px`
                    }}
                  >
                    <span className="block truncate">
                      {item.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}