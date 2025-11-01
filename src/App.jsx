import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar, { drawerWidth } from "./components/Navbar";
import HomePage from "./pages/HomePage";
import "./App.css";
import ClaimForm from "./pages/ClaimForm";
import AdminDashboard from "./pages/AdminDashboard";
import MyPolicies from "./pages/MyPolicies";
import Login from "./pages/Login";

const MainContent = () => {
  const { sidebarOpen } = useSidebar();

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        mt: 8, // Account for AppBar height
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#f5f5f5",
        width: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
        transition: (theme) =>
          theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage sidebarOpen={sidebarOpen} />} />
        <Route path="/claim-submition" element={<ClaimForm />} />
        <Route path="/claims-submission" element={<ClaimForm />} />
        <Route path="/agent-dashboard" element={<AdminDashboard />} />
        <Route path="/my-policies" element={<MyPolicies />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Box>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SidebarProvider>
          <Box sx={{ display: "flex" }}>
            <Navbar />
            <MainContent />
          </Box>
        </SidebarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
