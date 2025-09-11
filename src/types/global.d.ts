import { ReactNode } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Add any custom JSX elements here
      [elemName: string]: any;
    }
  }
}
