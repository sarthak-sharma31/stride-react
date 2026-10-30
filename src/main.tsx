import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Invite } from './pages/Invite';
import { NotFound } from './pages/NotFound';
import { Policy } from './pages/Policy';
import './styles.css';

// The admin console pulls in Firebase; load it only when someone opens /admin.
const Admin = lazy(() => import('./pages/Admin'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/r/:code" element={<Invite />} />
        <Route path="/privacy" element={<Policy doc="privacy" />} />
        <Route path="/terms" element={<Policy doc="terms" />} />
        <Route path="/rewards-policy" element={<Policy doc="rewards" />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={null}>
              <Admin />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
