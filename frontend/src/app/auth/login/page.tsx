'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page where login modal is available
    router.push('/');
  }, [router]);

  return null;
}
