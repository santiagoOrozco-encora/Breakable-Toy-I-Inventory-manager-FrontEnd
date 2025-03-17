import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ProductManager from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProductManager />
  </StrictMode>,
)
