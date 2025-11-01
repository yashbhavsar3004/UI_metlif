import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import { SidebarProvider, useSidebar } from './contexts/SidebarContext'
import Navbar, { drawerWidth } from './pages/Navbar'
import HomePage from './pages/HomePage'
import './App.css'

const MainContent = () => {
  const { sidebarOpen } = useSidebar();
  
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        mt: 8, // Account for AppBar height
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f5f5f5',
        width: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
        transition: (theme) =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage sidebarOpen={sidebarOpen} />} />
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
  );
}

export default App;
