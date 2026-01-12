import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from "react-router"
import Toaster from "react-hot-toast"
import App from './App.jsx'
import './index.css'
import AuthContextProvider from './context/AuthContextProvider.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <App />
          <Toaster />
        </AuthContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
