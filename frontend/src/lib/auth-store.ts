import { create } from 'zustand';
import { clearUserAllStorage } from './user-storage';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface AuthStore {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  setUser: (user: AuthUser | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  setUser: (user: AuthUser | null) => set({ user }),
  setTokens: (accessToken: string, refreshToken: string) => {
    set({ accessToken, refreshToken });
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  },
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  logout: () => {
    // NE JAMAIS SUPPRIMER les données utilisateur lors d'une déconnexion!
    // Les messages, notes de calendrier, etc doivent rester persistés dans localStorage
    // Ils seront rechargés lors du prochain login
    
    if (typeof window !== 'undefined') {
      // Nettoyer seulement les tokens et les données de session temporaire
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('kyndex_currentUser');

      // Nettoyer aussi les données temporaires de sessionId
      const sessionId = sessionStorage.getItem('kyndex_sessionId');
      if (sessionId) {
        // Supprimer tous les items relatifs à cette session
        const keysToDelete: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith(`session_${sessionId}_`)) {
            keysToDelete.push(key);
          }
        }
        keysToDelete.forEach(key => sessionStorage.removeItem(key));
        sessionStorage.removeItem('kyndex_sessionId');
      }
    }

    // Puis nettoyer les tokens du store
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('kyndex_currentUser');
    }
  },
  initialize: () => {
    if (typeof window !== 'undefined') {
      // Vérifier d'abord les tokens
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken && refreshToken) {
        set({ accessToken, refreshToken });
      }
      
      // Fallback: vérifier kyndex_currentUser (mode localStorage simple)
      const kyndexUser = localStorage.getItem('kyndex_currentUser');
      if (kyndexUser) {
        try {
          const user = JSON.parse(kyndexUser);
          set({
            user: {
              id: user.id?.toString() || 'user-' + Date.now(),
              email: user.email,
              firstName: user.firstname,
              lastName: user.lastname,
              role: 'user',
            },
            accessToken: 'kyndex-token',
            refreshToken: 'kyndex-token',
          });
        } catch (e) {
          console.error('Failed to parse kyndex_currentUser', e);
        }
      }
    }
  },
}));
