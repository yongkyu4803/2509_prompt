'use client';

import { AlertTriangle, Database, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function DatabaseNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-800 mb-2">
            <Database className="inline w-4 h-4 mr-1" />
            데이터베이스 설정 필요
          </h3>
          <p className="text-amber-700 text-sm mb-3">
            카테고리 관리 기능이 완전히 작동하려면 Supabase에서 categories 테이블을 생성해야 합니다.
            현재는 임시 모드로 작동하며, 새로고침 시 변경사항이 초기화됩니다.
          </p>
          <div className="flex items-center gap-3">
            <a
              href="https://rxwztfdnragffxbmlscf.supabase.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors inline-flex items-center gap-1"
            >
              <ExternalLink size={14} />
              Supabase Dashboard
            </a>
            <button
              onClick={() => setIsVisible(false)}
              className="text-sm text-amber-600 hover:text-amber-800 transition-colors"
            >
              나중에 설정
            </button>
          </div>
          <details className="mt-3">
            <summary className="text-sm text-amber-600 cursor-pointer hover:text-amber-800">
              설정 방법 보기
            </summary>
            <div className="mt-2 text-xs text-amber-600 bg-amber-100 p-3 rounded">
              <p className="mb-2">1. 위의 Supabase Dashboard 링크 클릭</p>
              <p className="mb-2">2. 좌측 메뉴에서 "SQL Editor" 선택</p>
              <p className="mb-2">3. SUPABASE_SETUP.md 파일의 SQL 코드 실행</p>
              <p>4. 페이지 새로고침 후 정상 작동 확인</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}