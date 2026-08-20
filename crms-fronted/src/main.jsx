import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import store from './redux/store'

// expose store in development for debug helpers (mock user)
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-undef
  window.__STORE__ = store
}

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" />
    </BrowserRouter>
  </StrictMode>,
)