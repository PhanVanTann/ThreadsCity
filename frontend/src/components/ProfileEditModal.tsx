'use client';
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "src/hook/useClickOutside";
import toast from "react-hot-toast";
import { getUserById } from "src/redux/api/apiRequestUser";
import { useDispatch, useSelector } from "react-redux";

type Profile = {
  first_name?: string;
  last_name?: string;
  avatar?: string;
  introduce?: string;
};

export default function ProfileEditModal({
  open,
  onClose,
  initial,
  onSubmit,
  loading = false,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Profile;
  onSubmit: (fd: FormData) => Promise<void> | void;
  loading?: boolean;
}) {

  const [firstName, setFirstName] = useState(initial?.first_name ?? "");
  const [lastName, setLastName] = useState(initial?.last_name ?? "");
  const [introduce, setintroduce] = useState(initial?.introduce ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(initial?.avatar);
  const [confirmOpen, setConfirmOpen] = useState(false);
  
  const isDirty =
    firstName !== (initial?.first_name ?? "") ||
    lastName !== (initial?.last_name ?? "") ||
    introduce !== (initial?.introduce ?? "") ||
    !!file;

  const boxRef = useRef<HTMLDivElement | null>(null);
  useClickOutside([boxRef], () => (isDirty ? setConfirmOpen(true) : onClose()), {
    enabled: open && !confirmOpen,
    onEscape: () => (isDirty ? setConfirmOpen(true) : onClose()),
  });

  useEffect(() => {
    if (!open) return;
    // reset theo initial mỗi lần mở
    setFirstName(initial?.first_name ?? "");
    setLastName(initial?.last_name ?? "");
    setintroduce(initial?.introduce ?? "");
    setFile(null);
    setPreview(initial?.avatar);

  }, [open, initial]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center"
      onMouseDown={(e) => {
        if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
          isDirty ? setConfirmOpen(true) : onClose();
        }
      }}
    >
      <div
        ref={boxRef}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-[520px] rounded-2xl bg-white dark:bg-[#111] border border-[#2b2b2b] p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">Chỉnh sửa hồ sơ</div>
          <button className="text-sm text-gray-500 hover:opacity-80 cursor-pointer" onClick={() => (isDirty ? setConfirmOpen(true) : onClose())}>
            Đóng
          </button>
        </div>

        <div className="flex gap-3 items-start">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 shrink-0">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-xs text-gray-500">No avatar</div>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Ảnh đại diện</label>
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setFile(f);
                setPreview(f ? URL.createObjectURL(f) : initial?.avatar);
              }}
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Họ</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-[#2b2b2b] bg-white dark:bg-[#181818] p-2 text-gray-900 dark:text-white outline-none"
              placeholder="Nguyễn"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Tên</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-[#2b2b2b] bg-white dark:bg-[#181818] p-2 text-gray-900 dark:text-white outline-none"
              placeholder="Văn A"
            />
          </div>
        </div>

        <div className="mt-3">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Giới thiệu</label>
          <textarea
            value={introduce}
            onChange={(e) => setintroduce(e.target.value)}
            className="w-full h-24 rounded-lg border border-gray-300 dark:border-[#2b2b2b] bg-white dark:bg-[#181818] p-2 text-gray-900 dark:text-white outline-none resize-none"
            placeholder="Mô tả ngắn..."
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-[#2b2b2b] text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-[#222]"
            onClick={() => (isDirty ? setConfirmOpen(true) : onClose())}
          >
            Hủy
          </button>
          <button
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/80 disabled:opacity-60"
            onClick={async () => {
              const fd = new FormData();
              fd.append("first_name", firstName);
              fd.append("last_name", lastName);
              fd.append("introduce", introduce);
              if (file) fd.append("avatar", file);
              await onSubmit(fd);
            }}
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>

      {/* confirm thoát */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-[1010] bg-black/40 grid place-items-center"
          onMouseDown={() => setConfirmOpen(false)}
        >
          <div
            className="w-[360px] rounded-xl bg-white dark:bg-[#181818] p-4"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="text-base font-semibold mb-2">Huỷ thay đổi?</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Bạn đang có thay đổi chưa lưu. Bạn có chắc muốn thoát?
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-[#2b2b2b]"
                onClick={() => setConfirmOpen(false)}
              >
                Ở lại
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={onClose}
              >
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
