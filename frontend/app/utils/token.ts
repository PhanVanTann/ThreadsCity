// utils/token.ts
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null; // đang ở server
  return localStorage.getItem('access_token');
};

export const setTokens = (access: string, refresh: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};
