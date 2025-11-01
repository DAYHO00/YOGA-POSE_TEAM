import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  nickname: string | null;
  login: (nickname: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      nickname: null,
      login: (nickname) => set({ isLoggedIn: true, nickname }),
      logout: () => set({ isLoggedIn: false, nickname: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
