'use client';
import React, { useEffect, useRef } from 'react';

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function DeleteConfirmModal({
  open,
  title = 'Xoá bài viết?',
  message = 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xoá bài viết này không?',
  confirmText = 'Xoá',
  cancelText = 'Huỷ',
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  const boxRef = useRef<HTMLDivElement>(null);

  // ESC để đóng
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !loading && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (boxRef.current && !boxRef.current.contains(e.target as Node) && !loading) {
          onClose();
        }
      }}
      aria-modal
      role="dialog"
    >
      <div
        ref={boxRef}
        className="w-full max-w-md rounded-2xl border border-[#3d3d3d] bg-gray-100 dark:bg-[#181818] shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#3d3d3d]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
            {/* Trash icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9zm2 2h2v1h-2V5zM8 7h8v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>

        {/* Body */}
        <div className="px-4 py-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[#3d3d3d]">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-[#3d3d3d] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-[#222]"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Đang xoá...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}