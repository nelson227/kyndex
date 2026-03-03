'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard - onboarding is done through the modal on homepage
    router.push('/dashboard');
  }, [router]);

  return null;
}
