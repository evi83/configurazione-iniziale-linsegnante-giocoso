import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { GlobalStyle } from './styles/global.ts' // Importa il GlobalStyle corretto e tematico

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalStyle /> {/* Il GlobalStyle prenderà il tema dal ThemeProvider in App.tsx */}
    <App />
  </React.StrictMode>,
)
