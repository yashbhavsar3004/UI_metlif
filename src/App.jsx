import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Box, Button, Typography, Container } from "@mui/material";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import Navbar, { drawerWidth } from "./components/Navbar";
import ClaimForm from "./pages/ClaimForm";
import "./App.css";

const MainContent = () => {
  const { sidebarOpen } = useSidebar();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        mt: 8, // Account for AppBar height
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#f5f5f5",
        ml: sidebarOpen ? `${drawerWidth}px` : 0,
        transition: (theme) =>
          theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                }}
              >
                <Typography variant="h3" gutterBottom sx={{ color: "#0066cc", mb: 3 }}>
                  Welcome to MetLife
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  File your insurance claim with ease
                </Typography>
                <Button
                  component={Link}
                  to="/claim-form"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#0066cc",
                    "&:hover": {
                      backgroundColor: "#0052a3",
                    },
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                  }}
                >
                  Start Claim Form
                </Button>
              </Box>
            </Container>
          }
        />
        <Route path="/claim-form" element={<ClaimForm />} />
      </Routes>
    </Box>
  );
};

function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Box sx={{ display: "flex" }}>
          <Navbar />
          <MainContent />
        </Box>
      </SidebarProvider>
    </BrowserRouter>
  );
}

export default App;
