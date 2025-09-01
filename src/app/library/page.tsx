'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PromptGrid from '@/components/prompt/PromptGrid';
import PromptModal from '@/components/prompt/PromptModal';
import AddPromptModal from '@/components/prompt/AddPromptModal';
import CategoryManagementModal from '@/components/category/CategoryManagementModal';
import NoticeCards from '@/components/notice/NoticeCards';
import { usePrompts } from '@/contexts/PromptContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Prompt } from '@/lib/types';

export default function Home() {
  const {
    prompts,
    filteredPrompts,
    searchQuery,
    selectedCategory,
    viewMode,
    sortBy,
    loading,
    error,
    setSearchQuery,
    setSelectedCategory,
    setViewMode,
    setSortBy,
    toggleFavorite,
    addPrompt,
    updatePrompt,
    deletePrompt,
  } = usePrompts();

  const { hasPermission } = usePermissions();

  const [activeMenu, setActiveMenu] = useState('all');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false);

  // Get prompts based on active menu
  const getDisplayPrompts = () => {
    switch (activeMenu) {
      case 'favorites':
        return filteredPrompts.filter(prompt => prompt.isFavorite);
      case 'all':
      default:
        return filteredPrompts;
    }
  };

  const displayPrompts = getDisplayPrompts();

  const handleMenuChange = (menu: string) => {
    setActiveMenu(menu);
    if (menu === 'add') {
      setIsAddModalOpen(true);
      setActiveMenu('all'); // Reset to all after opening add modal
    }
  };

  const handlePromptClick = async (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    // Increment usage hours (only if user has update permission)
    if (hasPermission('canUpdate')) {
      try {
        await updatePrompt(prompt.id, { usageHours: prompt.usageHours + 1 });
      } catch (error) {
        console.error('Failed to update usage hours:', error);
      }
    }
  };

  const handleEditPrompt = () => {
    if (selectedPrompt && hasPermission('canUpdate')) {
      setEditingPrompt(selectedPrompt);
      setSelectedPrompt(null);
    }
  };

  const handleDeletePrompt = () => {
    if (selectedPrompt && hasPermission('canDelete')) {
      setShowDeleteConfirm(selectedPrompt.id);
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      await deletePrompt(id);
      setShowDeleteConfirm(null);
      setSelectedPrompt(null);
    } catch (error) {
      console.error('Failed to delete prompt:', error);
    }
  };

  const handleSavePrompt = async (promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🎯 handleSavePrompt 호출됨');
      console.log('📋 editingPrompt:', editingPrompt ? JSON.stringify(editingPrompt, null, 2) : 'null');
      console.log('📋 promptData:', JSON.stringify(promptData, null, 2));
      
      if (editingPrompt) {
        console.log('✏️ 프롬프트 업데이트 모드');
        console.log('📋 업데이트 대상 ID:', editingPrompt.id);
        await updatePrompt(editingPrompt.id, promptData);
        console.log('✅ 프롬프트 업데이트 완료');
        setEditingPrompt(null);
      } else {
        console.log('➕ 프롬프트 추가 모드');
        await addPrompt(promptData);
        console.log('✅ 프롬프트 추가 완료');
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('❌ handleSavePrompt 실패:', error);
    }
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">프롬프트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 에러 표시 */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <Layout
        activeMenu={activeMenu}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        viewMode={viewMode}
        sortBy={sortBy}
        totalPrompts={prompts.length}
        onMenuChange={handleMenuChange}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onViewModeChange={setViewMode}
        onSortChange={setSortBy}
        onCategoryManagementOpen={() => {
          console.log('카테고리 관리 모달 열기 시도');
          setIsCategoryManagementOpen(true);
        }}
      >
        <NoticeCards />
        <PromptGrid
          prompts={displayPrompts}
          viewMode={viewMode}
          onPromptClick={handlePromptClick}
          onFavoriteToggle={(id: string) => hasPermission('canUpdate') ? toggleFavorite(id) : undefined}
        />
      </Layout>

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <PromptModal
          prompt={selectedPrompt}
          isOpen={!!selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
          onEdit={handleEditPrompt}
          onDelete={handleDeletePrompt}
          onFavoriteToggle={() => hasPermission('canUpdate') ? toggleFavorite(selectedPrompt.id) : undefined}
        />
      )}

      {/* Add/Edit Prompt Modal */}
      <AddPromptModal
        isOpen={isAddModalOpen || !!editingPrompt}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingPrompt(null);
        }}
        onSave={handleSavePrompt}
        initialData={editingPrompt}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">프롬프트 삭제</h3>
                <p className="text-sm text-gray-600">이 작업은 되돌릴 수 없습니다.</p>
              </div>
            </div>
            <p className="text-gray-700 mb-6">
              정말로 이 프롬프트를 삭제하시겠습니까?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={isCategoryManagementOpen}
        onClose={() => setIsCategoryManagementOpen(false)}
      />
    </>
  );
}