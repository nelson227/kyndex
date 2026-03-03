/**
 * Utility pour gérer localStorage de manière sécurisée et isolée par utilisateur
 * Chaque utilisateur a ses propres données dans localStorage avec une clé unique
 */

interface UserStorageOptions {
  userId?: string;
  fallbackKey?: string; // Pour migration de données anciennes
}

/**
 * Génère une clé de stockage unique par utilisateur
 * @param userId - ID de l'utilisateur
 * @param dataKey - Nom de la donnée (ex: 'calendar_notes', 'tasks', etc)
 * @returns Clé de stockage formatée
 */
export const generateUserStorageKey = (userId: string, dataKey: string): string => {
  if (!userId || userId.trim() === '') {
    console.warn('⚠️ userId is empty in generateUserStorageKey');
    return dataKey; // Fallback si userId vide
  }
  return `user_${userId}_${dataKey}`;
};

/**
 * Récupère les données de localStorage avec isolation par utilisateur
 * @param dataKey - Clé de la donnée
 * @param userId - ID de l'utilisateur (optionnel, utilise le store par défaut)
 * @returns Données parsées ou null
 */
export const getUserStorage = <T>(dataKey: string, userId?: string): T | null => {
  if (typeof window === 'undefined') return null;

  // Utiliser l'userId fourni ou essayer de l'obtenir du store
  let currentUserId = userId;
  if (!currentUserId) {
    const kyndexUser = localStorage.getItem('kyndex_currentUser');
    if (kyndexUser) {
      try {
        const user = JSON.parse(kyndexUser);
        currentUserId = user.id?.toString() || user.email;
      } catch (e) {
        console.error('Failed to get userId from localStorage', e);
      }
    }
  }

  if (!currentUserId) {
    console.warn(`⚠️ No userId available for getting ${dataKey}`);
    return null;
  }

  const storageKey = generateUserStorageKey(currentUserId, dataKey);
  
  try {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`Failed to parse user storage data for key: ${storageKey}`, e);
    return null;
  }
};

/**
 * Sauvegarde les données dans localStorage avec isolation par utilisateur
 * @param dataKey - Clé de la donnée
 * @param data - Données à sauvegarder
 * @param userId - ID de l'utilisateur (optionnel, utilise le store par défaut)
 */
export const setUserStorage = <T>(dataKey: string, data: T, userId?: string): boolean => {
  if (typeof window === 'undefined') return false;

  // Utiliser l'userId fourni ou essayer de l'obtenir du store
  let currentUserId = userId;
  if (!currentUserId) {
    const kyndexUser = localStorage.getItem('kyndex_currentUser');
    if (kyndexUser) {
      try {
        const user = JSON.parse(kyndexUser);
        currentUserId = user.id?.toString() || user.email;
      } catch (e) {
        console.error('Failed to get userId from localStorage', e);
      }
    }
  }

  if (!currentUserId) {
    console.error(`❌ No userId available for setting ${dataKey}`);
    return false;
  }

  const storageKey = generateUserStorageKey(currentUserId, dataKey);

  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`Failed to save user storage data for key: ${storageKey}`, e);
    return false;
  }
};

/**
 * Supprime les données de localStorage pour un utilisateur
 * @param dataKey - Clé de la donnée
 * @param userId - ID de l'utilisateur
 */
export const deleteUserStorage = (dataKey: string, userId?: string): boolean => {
  if (typeof window === 'undefined') return false;

  let currentUserId = userId;
  if (!currentUserId) {
    const kyndexUser = localStorage.getItem('kyndex_currentUser');
    if (kyndexUser) {
      try {
        const user = JSON.parse(kyndexUser);
        currentUserId = user.id?.toString() || user.email;
      } catch (e) {
        console.error('Failed to get userId from localStorage', e);
      }
    }
  }

  if (!currentUserId) {
    console.warn(`⚠️ No userId available for deleting ${dataKey}`);
    return false;
  }

  const storageKey = generateUserStorageKey(currentUserId, dataKey);

  try {
    localStorage.removeItem(storageKey);
    return true;
  } catch (e) {
    console.error(`Failed to delete user storage data for key: ${storageKey}`, e);
    return false;
  }
};

/**
 * Nettoie TOUTES les données d'un utilisateur de localStorage
 * Utilisé lors de la déconnexion
 * @param userId - ID de l'utilisateur
 */
export const clearUserAllStorage = (userId: string): boolean => {
  if (typeof window === 'undefined') return false;
  if (!userId) return false;

  try {
    const keysToDelete: string[] = [];
    
    // Parcourir tous les items de localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`user_${userId}_`)) {
        keysToDelete.push(key);
      }
    }

    // Supprimer tous les items de l'utilisateur
    keysToDelete.forEach(key => localStorage.removeItem(key));
    
    console.log(`✓ Cleared ${keysToDelete.length} items for user ${userId}`);
    return true;
  } catch (e) {
    console.error('Failed to clear user storage', e);
    return false;
  }
};

/**
 * Récupère tous les IDs utilisateur stockés dans localStorage
 * Utile pour debug et migration
 */
export const getAllStoredUserIds = (): string[] => {
  if (typeof window === 'undefined') return [];

  const userIds = new Set<string>();
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('user_')) {
      const match = key.match(/^user_(.+?)_.+/);
      if (match && match[1]) {
        userIds.add(match[1]);
      }
    }
  }

  return Array.from(userIds);
};
