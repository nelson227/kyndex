'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createApiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';

interface IconProps {
  className?: string;
}

const DiscoverIcon = ({ className }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
  </svg>
);

const MessageIcon = ({ className }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
  </svg>
);

const HeartIcon = ({ className }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ProfileIcon = ({ className }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const checkUnreadMessages = async () => {
      if (!user) return;
      try {
        const apiClient = createApiClient();
        const response = await apiClient.get('/messages/conversations');
        const convs = response.data;
        
        const totalUnread = convs.reduce((sum: number, conv: any) => {
          const unread = conv.messages?.filter((msg: any) => msg.senderId !== user.id).length || 0;
          return sum + unread;
        }, 0);
        
        setUnreadCount(totalUnread);
      } catch (error) {
        console.error('Error checking unread messages:', error);
      }
    };

    checkUnreadMessages();
    // Check every 5 seconds for new messages
    const interval = setInterval(checkUnreadMessages, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const navItems = [
    { href: '/discover', label: 'Découvrir', icon: DiscoverIcon },
    { href: '/messages', label: 'Messages', icon: MessageIcon, badge: unreadCount },
    { href: '/matches', label: 'Matches', icon: HeartIcon },
    { href: '/profile', label: 'Profil', icon: ProfileIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors relative ${
                active
                  ? 'text-blue-600 border-t-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-6 h-6" />
              {(item as any).badge > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {(item as any).badge > 9 ? '9+' : (item as any).badge}
                </span>
              )}
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
