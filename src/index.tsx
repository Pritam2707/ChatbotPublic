import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, Routes, BrowserRouter } from 'react-router-dom'; // routers
import './index.css';
import App from './App';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import reportWebVitals from './reportWebVitals';
import NotFound404 from './components/404';
import Terms from './components/terms';
import { AuthProvider } from './components/hooks/useAuth';

// Ensure `root` is not null by asserting it with a non-null assertion operator (!)
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  // This is correct usage of React.StrictMode as a value, not a type
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/terms" element={<Terms />} />
          <Route path="/404" element={<NotFound404 />} />
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

// Service Worker for offline capabilities
serviceWorkerRegistration.register();

// Measure performance (optional)
reportWebVitals();
