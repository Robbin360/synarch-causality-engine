'use client';

import dynamic from 'next/dynamic';
import { ModeProvider } from '@/components/ModeContext';

// Dynamically import the CausalityEngine component with SSR disabled
const CausalityEngine = dynamic(() => import('@/components/CausalityEngine'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <ModeProvider>
      <CausalityEngine />
    </ModeProvider>
  );
}