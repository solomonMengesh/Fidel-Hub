import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { LanguageProvider } from './context/LanguageContext'; // Import LanguageProvider
import { SocketProvider } from "./context/SocketContext.jsx";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Ensure BrowserRouter is the top wrapper */}

      <AuthProvider>
        <SocketProvider>
        <LanguageProvider> {/* Wrap with LanguageProvider */}
        <App />
        </LanguageProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
