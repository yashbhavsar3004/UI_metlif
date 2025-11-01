import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { SidebarProvider, useSidebar } from './contexts/SidebarContext'
import Navbar, { drawerWidth } from './pages/Navbar'
import './App.css'

const MainContent = () => {
  const { sidebarOpen } = useSidebar();
  
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        mt: 8, // Account for AppBar height
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f5f5f5',
        ml: sidebarOpen ? `${drawerWidth}px` : 0,
        transition: (theme) =>
          theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        {/* Add more routes here */}
      </Routes>
    </Box>
  );
};

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Box sx={{ display: 'flex' }}>
          <Navbar />
          <MainContent />
        </Box>
      </SidebarProvider>
    </BrowserRouter>
  )
}

export default App
