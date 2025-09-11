'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  Edit3, 
  RefreshCw, 
  Plus, 
  Archive, 
  TrendingUp,
  ChevronRight,
  CheckCircle,
  Star,
  Search,
  Filter,
  Copy,
  Bookmark,
  Settings,
  BarChart3,
  Users,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  steps: {
    title: string;
    content: string;
    tips?: string[];
    example?: string;
  }[];
}

const guideSections: GuideSection[] = [
  {
    id: 'library',
    title: '라이브러리 활용법',
    icon: BookOpen,
    description: '프롬프트 라이브러리에서 원하는 프롬프트를 빠르게 찾고 효과적으로 활용하는 방법을 알아보세요.',
    steps: [
      {
        title: '검색 및 필터링으로 원하는 프롬프트 찾기',
        content: '키워드 검색과 레벨별 필터를 활용해 목적에 맞는 프롬프트를 빠르게 찾을 수 있습니다.',
        tips: [
          '구체적인 키워드를 사용하여 검색 정확도 높이기',
          '초급/중급/고급 레벨로 난이도별 필터링',
          '최신순/인기순 정렬로 트렌드 파악'
        ],
        example: '"보고서 작성"으로 검색 → 중급 레벨 필터 → 사용량 높은 순으로 정렬'
      },
      {
        title: '프롬프트 상세 정보 확인하기',
        content: '각 프롬프트의 세부 내용, 사용 목적, 예상 결과를 미리 확인하여 적합성을 판단하세요.',
        tips: [
          '프롬프트 설명과 목적 꼼꼼히 읽기',
          '사용 시간과 인기도 참고',
          '관련 태그로 유사 프롬프트 탐색'
        ]
      },
      {
        title: '즐겨찾기로 자주 쓰는 프롬프트 관리',
        content: '효과가 좋았던 프롬프트를 즐겨찾기에 추가하여 빠르게 재사용할 수 있습니다.',
        tips: [
          '테스트 후 효과적인 프롬프트만 선별하여 즐겨찾기',
          '주제별로 즐겨찾기 정리',
          '주기적으로 즐겨찾기 목록 정리 및 업데이트'
        ]
      }
    ]
  },
  {
    id: 'customize',
    title: '프롬프트 커스터마이징',
    icon: Edit3,
    description: '기존 프롬프트를 자신의 상황과 목적에 맞게 수정하고 개선하는 방법을 배워보세요.',
    steps: [
      {
        title: '맥락 정보 추가하기',
        content: '프롬프트에 구체적인 상황, 대상, 목적을 추가하여 더 정확한 결과를 얻을 수 있습니다.',
        tips: [
          '대상 독자나 사용 목적 명시',
          '업무나 프로젝트의 구체적 맥락 설명',
          '원하는 톤앤매너나 스타일 지정'
        ],
        example: '기본: "회의록을 작성해줘" → 개선: "IT 팀 주간 회의록을 작성해줘. 참석자는 개발팀 5명, 결정사항과 액션아이템을 구분하여 정리해줘"'
      },
      {
        title: '출력 형식 조정하기',
        content: '결과물의 형태를 용도에 맞게 조정하여 바로 활용할 수 있도록 만드세요.',
        tips: [
          '표, 목록, 단락 등 원하는 형식 지정',
          '글자 수나 분량 제한 설정',
          '특정 템플릿이나 양식에 맞춰 요청'
        ],
        example: '"3가지 방안을 제시해줘" → "3가지 방안을 표 형식으로 제시하고, 각각 장단점과 예상 비용을 포함해줘"'
      },
      {
        title: '변수와 플레이스홀더 활용',
        content: '반복 사용할 프롬프트는 변수를 사용하여 재사용성을 높이세요.',
        tips: [
          '[제품명], [기간], [대상]과 같은 변수 사용',
          '상황별로 바꿔야 할 부분 미리 식별',
          '변수 설명을 별도로 정리해두기'
        ]
      }
    ]
  },
  {
    id: 'iterate',
    title: '반복 개선 프로세스',
    icon: RefreshCw,
    description: '프롬프트를 여러 번 테스트하고 개선하여 최적의 결과를 얻는 체계적인 방법을 익혀보세요.',
    steps: [
      {
        title: '초기 버전 테스트',
        content: '선택한 프롬프트를 실제 상황에 적용해보고 결과를 객관적으로 평가하세요.',
        tips: [
          '여러 가지 입력값으로 테스트',
          '예상한 결과와 실제 결과 비교',
          '개선이 필요한 부분 구체적으로 기록'
        ]
      },
      {
        title: '문제점 분석 및 개선안 도출',
        content: '테스트 결과를 바탕으로 어떤 부분을 어떻게 개선할지 계획을 세우세요.',
        tips: [
          '부정확한 결과의 원인 분석',
          '누락된 정보나 조건 식별',
          '더 구체적인 지시사항 추가'
        ],
        example: '문제: 너무 길다 → 개선: "200자 이내로" 조건 추가'
      },
      {
        title: '수정된 버전 재테스트',
        content: '개선된 프롬프트로 다시 테스트하고 이전 버전과 비교하여 성능을 평가하세요.',
        tips: [
          '동일한 조건에서 테스트하여 공정한 비교',
          '여러 차례 테스트로 일관성 확인',
          '개선 효과를 수치나 등급으로 측정'
        ]
      },
      {
        title: '최적화 완성',
        content: '만족할 만한 결과가 나올 때까지 2-3회 반복하여 최종 버전을 완성하세요.',
        tips: [
          '완벽보다는 충분히 만족스러운 수준에서 마무리',
          '과도한 복잡성보다는 실용성 우선',
          '최종 버전의 사용법을 문서화'
        ]
      }
    ]
  },
  {
    id: 'create',
    title: '나만의 프롬프트 만들기',
    icon: Plus,
    description: '기존 프롬프트로는 해결되지 않는 특별한 요구사항을 위한 새로운 프롬프트를 처음부터 만들어보세요.',
    steps: [
      {
        title: '목적과 범위 명확히 정의하기',
        content: '새 프롬프트가 해결해야 할 구체적인 문제와 달성하고자 하는 목표를 명확히 하세요.',
        tips: [
          '해결하고자 하는 구체적인 문제 정의',
          '대상 사용자나 상황 범위 설정',
          '성공 기준과 평가 방법 미리 정하기'
        ]
      },
      {
        title: '구조와 템플릿 설계',
        content: '효과적인 프롬프트의 기본 구조를 바탕으로 나만의 템플릿을 만드세요.',
        tips: [
          '역할 지정 → 맥락 설명 → 구체적 요청 → 출력 형식 순서',
          '필수 요소와 선택 요소 구분',
          '재사용 가능한 모듈형 구조로 설계'
        ]
      },
      {
        title: '초안 작성 및 검토',
        content: '설계한 구조에 따라 초안을 작성하고 누락된 부분이 없는지 점검하세요.',
        tips: [
          '명확하고 이해하기 쉬운 언어 사용',
          '모호한 표현이나 지시사항 제거',
          '동료나 사용자에게 피드백 요청'
        ]
      }
    ]
  },
  {
    id: 'archive',
    title: '체계적인 아카이빙',
    icon: Archive,
    description: '만들어진 프롬프트를 효율적으로 분류하고 관리하여 언제든지 쉽게 찾아 사용할 수 있도록 하세요.',
    steps: [
      {
        title: '분류 체계 구축하기',
        content: '프롬프트의 목적, 주제, 사용 빈도에 따른 체계적인 분류 기준을 만드세요.',
        tips: [
          '업무 분야별, 문서 유형별 등 일관된 기준 적용',
          '너무 세분화하지 말고 직관적인 카테고리 사용',
          '태그 시스템으로 다중 분류 가능하게 설정'
        ],
        example: '카테고리: 문서작성 → 태그: 보고서, 기획서, 이메일'
      },
      {
        title: '성능 데이터 기록하기',
        content: '각 프롬프트의 사용 횟수, 만족도, 효과를 기록하여 성능 기반 관리를 하세요.',
        tips: [
          '사용 빈도와 만족도를 5점 척도로 평가',
          '특별히 효과적이었던 상황과 조건 기록',
          '개선이 필요한 부분과 문제점 메모'
        ]
      },
      {
        title: '버전 관리하기',
        content: '프롬프트의 변화 과정을 기록하여 이전 버전으로 돌아가거나 변화를 추적할 수 있게 하세요.',
        tips: [
          '주요 수정사항과 수정 이유 기록',
          '날짜와 버전 번호로 히스토리 관리',
          '가장 효과적인 버전을 메인으로 설정'
        ]
      },
      {
        title: '정기적인 리뷰 및 정리',
        content: '주기적으로 프롬프트 라이브러리를 점검하고 불필요한 것은 정리하세요.',
        tips: [
          '한 달에 한 번 사용하지 않는 프롬프트 정리',
          '비슷한 기능의 프롬프트들 통합 검토',
          '새로운 카테고리나 태그 필요성 평가'
        ]
      }
    ]
  },
  {
    id: 'efficiency',
    title: '효율성 극대화',
    icon: TrendingUp,
    description: '프롬프트 라이브러리 활용을 통해 업무 효율성을 극대화하는 고급 전략을 익혀보세요.',
    steps: [
      {
        title: '워크플로우 최적화',
        content: '자주 하는 작업에 대한 프롬프트 사용 순서와 패턴을 정립하여 시간을 절약하세요.',
        tips: [
          '업무별 프롬프트 사용 순서 템플릿 만들기',
          '자주 쓰는 프롬프트들의 조합 패턴 정리',
          '한 번에 여러 단계를 처리할 수 있는 통합 프롬프트 개발'
        ]
      },
      {
        title: '성능 모니터링',
        content: '프롬프트 사용 결과를 지속적으로 모니터링하여 개선점을 찾아보세요.',
        tips: [
          '결과물의 품질과 소요 시간 추적',
          '자주 수정하게 되는 프롬프트 식별',
          '성과가 좋은 프롬프트의 공통점 분석'
        ]
      },
      {
        title: '팀 협업 및 공유',
        content: '효과적인 프롬프트를 팀원들과 공유하고 함께 발전시켜 나가세요.',
        tips: [
          '팀 내 베스트 프랙티스 공유',
          '프롬프트 개발 협업 프로세스 구축',
          '새로운 프롬프트에 대한 피드백 시스템 운영'
        ]
      }
    ]
  }
];

export default function HowToUsePage() {
  const [activeSection, setActiveSection] = useState(guideSections[0].id);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const toggleStep = (sectionId: string, stepIndex: number) => {
    const stepId = `${sectionId}-${stepIndex}`;
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const activeGuideSections = guideSections.find(section => section.id === activeSection);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          GQ-AI 프롬프트 라이브러리 사용법 가이드
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          프롬프트를 효과적으로 커스터마이징하고, 반복 개선을 통해 나만의 프롬프트를 만들어 체계적으로 관리하는 방법을 익혀보세요.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            <span>단계별 실습 가이드</span>
          </div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <span>실전 팁 & 노하우</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-purple-500" />
            <span>효율성 극대화 전략</span>
          </div>
        </div>
      </div>

      {/* 진행률 표시 */}
      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">학습 진행률</h3>
          <span className="text-sm text-gray-500">
            {completedSteps.size} / {guideSections.reduce((total, section) => total + section.steps.length, 0)} 단계 완료
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(completedSteps.size / guideSections.reduce((total, section) => total + section.steps.length, 0)) * 100}%`
            }}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 사이드바 네비게이션 */}
        <div className="lg:w-80">
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">가이드 목차</h2>
              <nav className="space-y-2">
                {guideSections.map((section, index) => {
                  const Icon = section.icon;
                  const sectionSteps = section.steps.length;
                  const completedInSection = section.steps.filter((_, stepIndex) => 
                    completedSteps.has(`${section.id}-${stepIndex}`)
                  ).length;
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-purple-50 border border-purple-200 text-purple-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        activeSection === section.id ? 'bg-purple-100' : 'bg-gray-100'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm leading-5">{section.title}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {completedInSection}/{sectionSteps} 단계 완료
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              activeSection === section.id ? 'bg-purple-400' : 'bg-gray-400'
                            }`}
                            style={{ width: `${(completedInSection / sectionSteps) * 100}%` }}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1">
          {activeGuideSections && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* 섹션 헤더 */}
              <div className="p-8 border-b border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <activeGuideSections.icon className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {activeGuideSections.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {activeGuideSections.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* 단계별 가이드 */}
              <div className="p-8">
                <div className="space-y-8">
                  {activeGuideSections.steps.map((step, stepIndex) => {
                    const stepId = `${activeGuideSections.id}-${stepIndex}`;
                    const isCompleted = completedSteps.has(stepId);
                    
                    return (
                      <div key={stepIndex} className="relative">
                        {/* 단계 번호와 연결선 */}
                        <div className="flex items-start gap-6">
                          <div className="flex-shrink-0 relative">
                            <button
                              onClick={() => toggleStep(activeGuideSections.id, stepIndex)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                                isCompleted
                                  ? 'bg-green-100 text-green-700 ring-2 ring-green-200'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle size={18} className="text-green-600" />
                              ) : (
                                stepIndex + 1
                              )}
                            </button>
                            {stepIndex < activeGuideSections.steps.length - 1 && (
                              <div className="absolute top-8 left-4 w-px h-16 bg-gray-200" />
                            )}
                          </div>

                          {/* 단계 내용 */}
                          <div className="flex-1 pb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              {step.title}
                            </h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                              {step.content}
                            </p>

                            {/* 팁 섹션 */}
                            {step.tips && step.tips.length > 0 && (
                              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Lightbulb className="text-blue-600" size={16} />
                                  <span className="text-sm font-semibold text-blue-900">실전 팁</span>
                                </div>
                                <ul className="space-y-1 text-sm text-blue-800">
                                  {step.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="flex items-start gap-2">
                                      <ChevronRight size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* 예시 섹션 */}
                            {step.example && (
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Target className="text-gray-600" size={16} />
                                  <span className="text-sm font-semibold text-gray-900">실제 예시</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {step.example}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 행동 유도 섹션 */}
      <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">지금 바로 시작해보세요!</h2>
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            가이드를 읽었다면 이제 실제로 적용해볼 차례입니다. 프롬프트 라이브러리에서 관심 있는 프롬프트를 찾아 커스터마이징해보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/library"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              <BookOpen size={20} />
              프롬프트 라이브러리 둘러보기
            </a>
            <a
              href="/study"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 text-white rounded-lg font-semibold hover:bg-purple-800 transition-colors"
            >
              <Users size={20} />
              프롬프트 스터디 참여하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}