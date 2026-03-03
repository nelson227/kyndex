'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page where signup modal is available
    router.push('/');
  }, [router]);

  return null;
}
