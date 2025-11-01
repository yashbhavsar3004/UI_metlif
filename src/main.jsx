import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196F3', // Blue
    },
    secondary: {
      main: '#4CAF50', // Green
    },
    error: {
      main: '#F44336', // Red
    },
    success: {
      main: '#4CAF50', // Green
    },
    info: {
      main: '#2196F3', // Blue
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
