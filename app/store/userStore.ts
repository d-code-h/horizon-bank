// store/userStore.ts
import { create } from 'zustand';

interface UserState {
  user: {
    $id: string;
    email: string;
    name: string;
  } | null;
  setUser: (user: { $id: string; email: string; name: string }) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

export const { setUser } = useUserStore.getState();

export default useUserStore;
