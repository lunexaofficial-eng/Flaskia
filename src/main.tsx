/**
 * Developed by MOHAMMAD NURULLAH
 * The Founder of OMYRA TECHNOLOGIES
 * Contact email: contact@omyra.org
 * Secondary email: matrixgyan0786@gmail.com
 * OMYRA ECOSYSTEM URL: www.omyra.org
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { CurrencyProvider } from './context/CurrencyContext.tsx';
import { AdminThemeProvider } from './context/AdminThemeContext.tsx';

// Prevent uncaught NotFoundError when browser extensions or translation tools mutate DOM nodes managed by React
if (typeof Node === 'function' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.apply(this, arguments as any) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    newNode: T,
    referenceNode: Node | null
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.apply(this, arguments as any) as T;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AdminThemeProvider>
        <CurrencyProvider>
          <App />
        </CurrencyProvider>
      </AdminThemeProvider>
    </ThemeProvider>
  </StrictMode>,
);


