import { useAuthStore } from '@/stores/auth.store';

export const useAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const userInfo = useAuthStore((state) => state.userInfo);
  const initialize = useAuthStore((state) => state.initialize);
  const logout = useAuthStore((state) => state.logout);
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const isAuthenticatedComputed = Boolean(accessToken && userInfo);

  return {
    accessToken,
    initialize,
    isAuthenticated: isAuthenticatedComputed,
    logout,
    setToken,
    setUser,
    userInfo,
  };
};
