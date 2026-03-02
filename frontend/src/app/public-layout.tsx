'use client';

import { useAuth } from '@/hooks/useAuth';
import { BottomNav } from '@/components/BottomNav';
import { NavBar } from '@/components/NavBar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <>
      <NavBar />
      <div className="pb-20">
        {children}
      </div>
      {user && <BottomNav />}
    </>
  );
}
