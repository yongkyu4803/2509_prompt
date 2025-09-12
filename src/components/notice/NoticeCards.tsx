'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Lightbulb, ChevronRight } from 'lucide-react';
import AdminNoticeModal from '@/components/modals/AdminNoticeModal';

export default function NoticeCards() {
  const [isAdminNoticeOpen, setIsAdminNoticeOpen] = useState(false);

  return (
    <>
      <div className="px-4 pt-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 프롬프트 사용법 가이드 버튼 */}
          <Link href="/how-to-use">
            <div className="group transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
              <div className="bg-white border border-gray-200 rounded-2xl text-gray-900 relative overflow-hidden shadow-sm group-hover:border-purple-300">
                <div style={{padding: '1rem'}}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 p-2.5 rounded-lg bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 
                          className="text-gray-900 group-hover:text-purple-700 transition-colors"
                          style={{
                            fontSize: '1.1rem', // 110% of text-base (1rem)
                            fontWeight: '700',   // 120% heavier than semibold (600)
                          }}
                        >
                          프롬프트 사용법 가이드
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          효과적인 커스터마이징과 체계적인 관리 방법
                        </p>
                      </div>
                    </div>
                    
                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                </div>

                {/* Subtle decorative element */}
                <div className="absolute top-4 right-4 opacity-10">
                  <div className="w-8 h-8 rounded-full bg-purple-100"></div>
                </div>
              </div>
            </div>
          </Link>

          {/* 관리자 공지사항 버튼 */}
          <div 
            onClick={() => setIsAdminNoticeOpen(true)}
            className="group transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
          >
            <div className="bg-white border border-gray-200 rounded-2xl text-gray-900 relative overflow-hidden shadow-sm group-hover:border-blue-300">
              <div style={{padding: '1rem'}}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 p-2.5 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                      <Bell className="w-5 h-5" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 
                        className="text-gray-900 group-hover:text-blue-700 transition-colors flex items-center gap-2"
                        style={{
                          fontSize: '1.1rem', // 110% of text-base (1rem)
                          fontWeight: '700',   // 120% heavier than semibold (600)
                        }}
                      >
                        관리자 공지사항
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                          NEW
                        </span>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        새로운 업데이트 및 중요 안내사항 확인
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>

              {/* Subtle decorative element */}
              <div className="absolute top-4 right-4 opacity-10">
                <div className="w-8 h-8 rounded-full bg-blue-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Notice Modal */}
      <AdminNoticeModal 
        isOpen={isAdminNoticeOpen}
        onClose={() => setIsAdminNoticeOpen(false)}
      />
    </>
  );
}