import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom"
import { CartProvider } from './Context/CartContext'
import { AuthProvider } from './Context/AuthContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ChakraProvider>
      <CartProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CartProvider>
    </ChakraProvider>,
  </BrowserRouter>
)
