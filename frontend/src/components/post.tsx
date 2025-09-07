'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { formatTimeAgo } from '../utils/formatIimeAgo.js';
import HeartButton from './heart';
import CommentList from '../components/comment/commentList.js';
import DeleteConfirmModal from './DeleteConfirmModal.js';
import CreateComment from './comment/createComment.js';
import { useDispatch, useSelector } from 'react-redux';
import { CreateComments, GetComments } from 'src/redux/api/apiRequestComment';
import { useNavigate } from 'react-router-dom';
import { deletePostByUser, getHeartbyPostId, getPostValidById } from 'src/redux/api/apiRequestPost.js';
import { getUserByCommentId } from 'src/redux/api/apiRequestUser.js';
import { resetListPost } from "src/redux/slice/postSlice";

type Post = {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  text: string | null;
  is_video?: boolean;
  flag: boolean;
  total_love: number;
  total_comment: number;
  created_at: string;
  status: string;
  media: string | string[];
  list_user_heart: string[];
};

const isVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov|m4v)$/i.test(url);

export default function Post({ post }: { post: Post }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openComment, setOpenComment] = useState(false);
  const [onClickMore, setOnClickMore] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [postid, setPostId] = useState('');

  const currentUserId = useSelector((s: any) => s.auth.login.currentUser?.user_id) as string | undefined;
  const isMyPost = currentUserId === post.user_id;

  const postId = String(post._id);

  const commentsState =
    useSelector((s: any) => s.comment.byPost?.[postId]) ||
    ({ data: null, isFetching: false, error: false, success: false } as any);
  const { data, isFetching, error, success } = commentsState;
  const comments: any[] = data?.data ?? [];

  const [commentCount, setCommentCount] = useState<number>(post.total_comment ?? 0);

  useEffect(() => {
    setCommentCount(post.total_comment ?? 0);
  }, [postId, post.total_comment]);

  useEffect(() => {
    if (!openComment) return;
    GetComments(postId, dispatch);
  }, [openComment, postId, dispatch]);

  useEffect(() => {
    if (success && Array.isArray(comments)) {
      setCommentCount(comments.length);
    }
  }, [success, comments.length]);

  const userPost = useSelector((s: any) => s.user.getUserByCommentId.data?.[postId]);

  const mediaUrl = useMemo(() => {
    const raw = post.media as unknown;
    if (Array.isArray(raw)) return raw.find(Boolean) ?? '';
    return (post.media as string) ?? '';
  }, [post.media]);

  const isVideo = mediaUrl ? isVideoUrl(mediaUrl) : false;

  const outerVideoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  const lastTimeRef = useRef<number>(0);
  const outerBoxRef = useRef<HTMLDivElement | null>(null);

  const lockScrollYRef = useRef(0);

  const handleClickProfileUser = useCallback(
    (user_id: string) => {
      if (user_id !== currentUserId) navigate(`/profile/${user_id}`);
    },
    [currentUserId, navigate]
  );

  useEffect(() => {
    if (post.user_id && postId) {
      // @ts-ignore
      dispatch(getUserByCommentId(post.user_id, postId));
    }
  }, [post.user_id, postId, dispatch]);

  const initialLiked = useMemo(() => {
    return !!currentUserId && Array.isArray(post.list_user_heart) && post.list_user_heart.includes(currentUserId);
  }, [currentUserId, post.list_user_heart]);

  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [loveCount, setLoveCount] = useState<number>(post.total_love ?? 0);

  useEffect(() => {
    setLiked(initialLiked);
    setLoveCount(post.total_love ?? 0);
  }, [postId]);

  const [pending, setPending] = useState(false);
  const opRef = useRef(0);

  const handleToggleLike = useCallback(async () => {
    if (!currentUserId || pending) return;

    const next = !liked;
    setPending(true);
    const myOp = ++opRef.current;

    setLiked(next);
    setLoveCount((c) => c + (next ? 1 : -1));

    try {
      const res: any = await getHeartbyPostId({ post_id: postId, user_id: currentUserId }, dispatch);
      if (myOp !== opRef.current) return;
      if (typeof res?.data?.liked === 'boolean') setLiked(res.data.liked);
      if (typeof res?.data?.total_love === 'number') setLoveCount(res.data.total_love);
    } catch {
      if (myOp === opRef.current) {
        setLiked((v) => !v);
        setLoveCount((c) => c + (next ? -1 : 1));
      }
    } finally {
      if (myOp === opRef.current) setPending(false);
    }
  }, [currentUserId, dispatch, liked, postId, pending]);

  useEffect(() => {
    if (!isVideo) return;

    if (openComment) {
      const outer = outerVideoRef.current;
      if (outer) {
        try {
          lastTimeRef.current = outer.currentTime || 0;
          outer.pause();
        } catch {}
      }
      requestAnimationFrame(() => {
        const modalV = modalVideoRef.current;
        if (modalV) {
          try {
            if (!Number.isNaN(lastTimeRef.current)) modalV.currentTime = lastTimeRef.current;
            const p = modalV.play();
            if (p && typeof p.then === 'function') p.catch(() => {});
          } catch {}
        }
      });
    }
  }, [openComment, isVideo]);

  useEffect(() => {
    if (!isVideo) return;
    const box = outerBoxRef.current;
    const video = outerVideoRef.current;
    if (!box || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const v = outerVideoRef.current;
        if (!v) return;
        if (openComment) {
          v.pause();
          return;
        }
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.25, 0.6, 1] }
    );

    observer.observe(box);
    const onVisibility = () => {
      const v = outerVideoRef.current;
      if (!v) return;
      if (document.hidden) v.pause();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isVideo, openComment]);

  const handleOpenModal = useCallback(() => {
    const outer = outerVideoRef.current;
    if (outer) {
      try {
        lastTimeRef.current = outer.currentTime || 0;
        outer.pause();
        outer.setAttribute('data-paused-by-modal', '1');
      } catch {}
    }
    setOpenComment(true);
  }, []);

  const handleReply = useCallback(
    async (text: string, parentId: string) => {
      if (!text.trim()) return;
      setCommentCount((c) => c + 1);
      await CreateComments(
        {
          user_id: currentUserId,
          post_id: postId,
          content: text.trim(),
          parent_id: parentId,
        },
        dispatch
      );
      GetComments(postId, dispatch);
    },
    [currentUserId, postId, dispatch]
  );

  const handleCreatedRootComment = useCallback(() => {
    setCommentCount((c) => c + 1);
    GetComments(postId, dispatch);
  }, [postId, dispatch]);

  useEffect(() => {
    if (!openComment) return;

    const html = document.documentElement;
    const body = document.body;

    lockScrollYRef.current = window.scrollY || window.pageYOffset || 0;

    const scrollbarW = window.innerWidth - (html?.clientWidth || 0);

    html.style.overflowY = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${lockScrollYRef.current}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflowY = 'scroll';
    if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;

    return () => {
      html.style.overflowY = '';
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflowY = '';
      body.style.paddingRight = '';
      window.scrollTo(0, lockScrollYRef.current);
    };
  }, [openComment]);


  const MAIN_MAX_CHARS  = 220; 
  const MODAL_MAX_CHARS = 80; 

  const [expandMainText, setExpandMainText]   = useState(false);
  const [expandModalText, setExpandModalText] = useState(false);

  const smartTruncate = (text: string, maxChars: number) => {
    if (!text) return text;
    if (text.length <= maxChars) return text;
    const slice = text.slice(0, maxChars);
    const lastSpace = slice.lastIndexOf(" ");
    const cut = lastSpace > maxChars * 0.5 ? slice.slice(0, lastSpace) : slice;
    return cut.trimEnd() + "…";
  };

  const isLongMainText  = !!post.text && post.text.length > MAIN_MAX_CHARS;
  const isLongModalText = !!post.text && post.text.length > MODAL_MAX_CHARS;

  const mainDisplayText = useMemo(
    () => (expandMainText || !isLongMainText ? post.text || "" : smartTruncate(post.text!, MAIN_MAX_CHARS)),
    [expandMainText, isLongMainText, post.text]
  );

  const modalDisplayText = useMemo(
    () => (expandModalText || !isLongModalText ? post.text || "" : smartTruncate(post.text!, MODAL_MAX_CHARS)),
    [expandModalText, isLongModalText, post.text]
  );
  

  return (
    <div className="w-[700px] relative flex flex-col items-start mt-5 bg-gray-100 dark:bg-[#181818] gap-5 border border-[#3d3d3d] rounded-lg p-4">
      {/* Header */}
      <div className="flex w-full items-center">
        <img
          src={userPost?.avatar || 'https://i.pravatar.cc/150?img=1'}
          onClick={() => handleClickProfileUser(post.user_id)}
          alt="avatar"
          className="object-cover rounded-full w-[40px] h-[40px] mr-2 cursor-pointer"
        />
        <div className="flex-grow flex items-center">
          <span className="text-white font-bold mr-2">
            {`${userPost?.last_name ?? ''} ${userPost?.first_name ?? ''}`.trim() || 'Người dùng'}
          </span>
          <span className="text-sm text-gray-300 mr-2">{formatTimeAgo(post.created_at)}</span>
        </div>

        {isMyPost && (
          <div onClick={() => setOnClickMore((v) => !v)} className="p-2 text-white cursor-pointer">
            <AiOutlineMore size={20} />
          </div>
        )}

        {onClickMore && isMyPost && (
          <div className="absolute top-10 right-4 bg-gray-700 text-white rounded-lg shadow-lg z-10">
            <button
              className="block px-4 py-2 hover:bg-gray-600 w-full text-left rounded-lg"
              onClick={() => {
                setOnClickMore(false);
                setOpenDel(true);
                setPostId(postId);
              }}
            >
              Xóa bài viết
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="w-full flex flex-col gap-3">
        {post.text && (
          <div className="w-full">
            <p className="text-md font-medium text-white whitespace-pre-wrap break-words">
              {mainDisplayText}
            </p>
            {isLongMainText && (
              <button
                type="button"
                onClick={() => setExpandMainText((v) => !v)}
                className="mt-2 text-sm text-gray-400 hover:text-white"
              >
                {expandMainText ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
        )}

        {mediaUrl && (
          <div
            ref={outerBoxRef}
            onClick={handleOpenModal}
            className="relative w-full h-[400px] flex justify-center items-center overflow-hidden rounded-lg"
          >
            {isVideo ? (
              <video
                ref={outerVideoRef}
                muted
                controls={!openComment}
                loop
                playsInline
                className="h-full rounded-lg"
              >
                <source src={mediaUrl} />
                Trình duyệt không hỗ trợ video.
              </video>
            ) : (
              <img src={mediaUrl} alt="media" className="h-full w-full object-contain rounded-lg" />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="w-full flex flex-col">
        <div className="flex gap-5">
          <HeartButton liked={liked} count={loveCount} onToggle={handleToggleLike} size="text-xl" disabled={pending} />
          <div className="flex items-center gap-1 text-gray-300">
            <button title="Bình luận" className="text-gray-300 h-[20px]" onClick={() => setOpenComment((v) => !v)}>
              <FaRegComment size={20} />
            </button>
            <span className="text-[20px]">{commentCount}</span>
          </div>
        </div>
      </div>

      {/* Modal bình luận */}
      {openComment && (
        <div
          className="fixed inset-0 z-[999] bg-black/50 flex items-center justify-center"
          onMouseDown={(e) => {
            const box = (e.currentTarget.querySelector('#comment-modal') as HTMLDivElement) || null;
            if (box && !box.contains(e.target as Node)) setOpenComment(false);
          }}
        >
          <div
            id="comment-modal"
            className={`w-full bg-gray-100 dark:bg-[#181818] border border-[#3d3d3d] rounded-lg h-[90vh] flex flex-col ${
              mediaUrl && mediaUrl.length > 0 ? 'max-w-[1300px]' : 'max-w-[700px]'
            }`}
          >
            <div className="shrink-0 p-3 border-b border-[#3d3d3d] flex justify-between">
              <h3 className="font-semibold">Bình luận</h3>
              <button onClick={() => setOpenComment(false)}>Đóng</button>
            </div>

            <div className="w-full h-full flex justify-between gap-3 p-4 overflow-hidden">
              {/* Media */}
              <div className="flex-shrink-0 w-full flex-1 flex justify-center items-center">
                {mediaUrl && mediaUrl.length > 0 && (isVideo ? (
                  <video
                    ref={modalVideoRef}
                    autoPlay
                    loop
                    muted
                    controls
                    playsInline
                    className="h-full rounded-lg"
                  >
                    <source src={mediaUrl} />
                  </video>
                ) : (
                  <img src={mediaUrl} className="h-full w-full object-contain rounded-lg" />
                ))}
              </div>

              {/* Vùng scroll */}
              <div className={`flex flex-col h-full ${mediaUrl && mediaUrl.length > 0 ? 'w-[30%]' : 'w-full'}`}>
                <div className="flex w-full items-center">
                  <img
                    src={post.avatar || 'https://i.pravatar.cc/150?img=1'}
                    alt="avatar"
                    className="object-cover rounded-full w-[40px] h-[40px] mr-2"
                  />
                  <div className="flex-grow flex items-center">
                    <span className="text-white font-bold mr-2">
                      {`${post.last_name ?? ''} ${post.first_name ?? ''}`.trim() || 'Người dùng'}
                    </span>
                    <span className="text-sm text-gray-300 mr-2">{formatTimeAgo(post.created_at)}</span>
                  </div>
                  
                </div>

                {post.text && (
                  <div className="w-full py-4 border-b border-[#3d3d3d]">
                    <p className="text-md font-medium text-white whitespace-pre-line">
                      {modalDisplayText}
                    </p>
                    {isLongModalText && (
                      <button
                        type="button"
                        onClick={() => setExpandModalText((v) => !v)}
                        className="mt-2 text-sm text-gray-400 hover:text-white" // khác màu với feed
                      >
                        {expandModalText ? "Thu gọn" : "Xem thêm"}
                      </button>
                    )}
                  </div>
                )}

                <div className="w-full flex flex-col">
                  <div className="flex gap-5">
                    <HeartButton
                      liked={liked}
                      count={loveCount}
                      onToggle={handleToggleLike}
                      size="text-xl"
                      disabled={pending}
                    />
                    <div className="flex items-center gap-1 text-gray-300">
                      <button title="Bình luận" className="text-gray-300 h-[20px]">
                        <FaRegComment size={20} />
                      </button>
                      <span className="text-[20px]">{commentCount}</span>
                    </div>
                  </div>
                </div>

                <div className="h-full overflow-y-auto scroll-dark">
                  {isFetching ? (
                    <div className="text-white p-5">Đang tải bình luận...</div>
                  ) : error ? (
                    <div className="text-red-400 p-5">Lỗi tải bình luận</div>
                  ) : comments.length > 0 ? (
                    <CommentList postId={postId} comments={comments} onReply={handleReply} />
                  ) : (
                    <div className="text-white p-5">Chưa có bình luận nào</div>
                  )}
                </div>

                <CreateComment
                  post_id={postId}
                  isActive={openComment}
                  // @ts-ignore
                  onCreated={handleCreatedRootComment}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={openDel}
        loading={deleting}
        onClose={() => setOpenDel(false)}
        onConfirm={async () => {
          try {
            setDeleting(true);
            await deletePostByUser({ user_id: currentUserId, post_id: postid }, dispatch);
            await dispatch(resetListPost());
            await getPostValidById(currentUserId as string, dispatch);
            setOpenDel(false);
          } finally {
            setDeleting(false);
          }
        }}
      />
    </div>
  );
}
