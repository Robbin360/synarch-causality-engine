'use client';

import { Html } from '@react-three/drei';

export default function LoadingIndicator() {
  return (
    <Html center>
      <div className="text-white text-xl">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-4 h-4 rounded-full bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="mt-4 text-center">Initializing Causality Engine...</p>
      </div>
    </Html>
  );
}