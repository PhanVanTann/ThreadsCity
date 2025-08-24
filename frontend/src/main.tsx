import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store.ts'
import { PersistGate } from 'redux-persist/integration/react'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from "@react-oauth/google";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
console.log("googleClientId =", googleClientId);
createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={googleClientId}>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
      <Toaster position="top-right" />
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
  </GoogleOAuthProvider>
)
