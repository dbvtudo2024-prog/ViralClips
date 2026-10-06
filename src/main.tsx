// Safeguard window.fetch to allow setters in strict mode
if (typeof window !== 'undefined' && window.fetch) {
  try {
    const originalFetch = window.fetch.bind(window);
    let customFetch = originalFetch;
    Object.defineProperty(window, 'fetch', {
      get: () => customFetch || originalFetch,
      set: (val: any) => {
        customFetch = typeof val === 'function' ? val.bind(window) : val;
      },
      configurable: true,
      enumerable: true,
    });
  } catch (_e) {
    // Already defined or non-configurable
  }
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
