import { useEffect, useState } from 'react';
import { getUserStorage } from '@/lib/user-storage';

/**
 * Hook personnalisé pour compter les messages non lus
 * Se met à jour automatiquement quand les conversations changent
 */
export const useUnreadCount = (userId?: string) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [calendarNotes, setCalendarNotes] = useState(0);

  useEffect(() => {
    if (!userId) {
      setUnreadMessages(0);
      setCalendarNotes(0);
      return;
    }

    // Fonction pour recalculer les compteurs
    const updateCounts = () => {
      const conversations = getUserStorage<any[]>('conversations', userId) || [];
      const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
      setUnreadMessages(totalUnread);

      const notes = getUserStorage<any[]>('calendar_notes', userId) || [];
      setCalendarNotes(notes.length);
    };

    // Mettre à jour les compteurs immédiatement
    updateCounts();

    // Écouter les changements personnalisés
    const handleCountsChange = () => {
      updateCounts();
    };

    window.addEventListener('unreadCountsUpdated', handleCountsChange);

    // Aussi vérifier périodiquement les changements (fallback)
    const interval = setInterval(updateCounts, 1000);

    return () => {
      window.removeEventListener('unreadCountsUpdated', handleCountsChange);
      clearInterval(interval);
    };
  }, [userId]);

  return { unreadMessages, calendarNotes };
};
