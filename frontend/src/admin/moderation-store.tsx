'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ModerationStatus = 'approved_auto'|'pending'|'approved_manual'|'rejected'|'blocked_auto';
export type Post = {
  id: string; user_id: string; text: string; image?: string; video?: string;
  flag: boolean; total_love: number; total_comment: number; created_at: string; score: number;
};
export type PostWithStatus = Post & {
  status: ModerationStatus; approvedBy?: 'system'|'moderator'; approvedAt?: string; rejectedAt?: string;
};

const API_BASE = ''; // nếu cần, set '/api' hoặc full URL

function mapToStatus(rows: Post[]): PostWithStatus[] {
  return rows.map(p => {
    const status: ModerationStatus =
      p.score >= 0.8 ? 'blocked_auto' : p.score >= 0.6 ? 'pending' : 'approved_auto';
    return {
      ...p,
      status,
      approvedBy: status === 'approved_auto' ? 'system' : undefined,
      approvedAt: status === 'approved_auto' ? new Date().toISOString() : undefined,
    };
  });
}

type Ctx = {
  posts: PostWithStatus[];
  loading: boolean;
  error?: string;
  approveManually: (id: string) => Promise<void>;
  rejectManually: (id: string) => Promise<void>;
  pendingPosts: PostWithStatus[];
  approvedAutoPosts: PostWithStatus[];
  approvedManualPosts: PostWithStatus[];
  refetch: () => Promise<void>;
};

const ModerationContext = createContext<Ctx | null>(null);

export function ModerationProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<PostWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(undefined);
      const res = await fetch(`${API_BASE}/api/moderation/posts`, { credentials: 'include' });
      if (!res.ok) throw new Error('Fetch posts failed');
      const data: Post[] = await res.json();
      setPosts(mapToStatus(data));
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const approveManually = async (id: string) => {
    // optimistic update
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, status: 'approved_manual', approvedBy: 'moderator', approvedAt: new Date().toISOString() }
      : p
    ));
    const res = await fetch(`${API_BASE}/api/moderation/approve`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
    });
    if (!res.ok) await fetchAll(); // rollback đơn giản bằng refetch
  };

  const rejectManually = async (id: string) => {
    setPosts(prev => prev.map(p => p.id === id
      ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString() }
      : p
    ));
    const res = await fetch(`${API_BASE}/api/moderation/reject`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id })
    });
    if (!res.ok) await fetchAll();
  };

  const pendingPosts = useMemo(() => posts.filter(p => p.status === 'pending'), [posts]);
  const approvedAutoPosts = useMemo(() => posts.filter(p => p.status === 'approved_auto'), [posts]);
  const approvedManualPosts = useMemo(() => posts.filter(p => p.status === 'approved_manual'), [posts]);

  return (
    <ModerationContext.Provider value={{
      posts, loading, error,
      approveManually, rejectManually,
      pendingPosts, approvedAutoPosts, approvedManualPosts,
      refetch: fetchAll
    }}>
      {children}
    </ModerationContext.Provider>
  );
}

export function useModeration() {
  const ctx = useContext(ModerationContext);
  if (!ctx) throw new Error('useModeration must be used within ModerationProvider');
  return ctx;
}
