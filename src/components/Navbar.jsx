import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  IconButton,
  Collapse,
  Stack,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Description as DescriptionIcon,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";

export const drawerWidth = 280;

const Navbar = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [expandedItems, setExpandedItems] = useState({});
  const [imageError, setImageError] = useState({});
  const navigate = useNavigate();

  const handleImageError = (location) => {
    setImageError((prev) => ({ ...prev, [location]: true }));
  };

  const navItems = [];


  const handleToggleExpand = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const sidebarContent = (
    <Box sx={{ width: drawerWidth, height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo Section - Only show when sidebar is open */}
      {sidebarOpen && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #e6e6e6",
            flexShrink: 0,
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <img
              src="https://www.metlife.com/content/dam/metlifecom/us/icons-header/MetLife.png"
              alt="MetLife"
              onError={() => handleImageError('sidebar')}
              onLoad={() => {
                setImageError((prev) => ({ ...prev, sidebar: false }));
              }}
              style={{
                height: '30px',
                display: imageError.sidebar ? 'none' : 'block',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
            {imageError.sidebar && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#000",
                  fontSize: "1.25rem",
                }}
              >
                MetLife
              </Typography>
            )}
          </Box>
          <IconButton
            onClick={toggleSidebar}
            sx={{ 
              display: { sm: "none" },
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      )}

      {/* Navigation Items - Removed */}

      {/* New Sidebar Navigation Buttons */}
      <Box sx={{ pt: sidebarOpen ? 1 : 0 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate('/claim-submition');
                // close sidebar on small screens
                if (sidebarOpen) toggleSidebar();
              }}
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary="CLAIMS SUBMISSION"
                primaryTypographyProps={{
                  fontSize: "0.8125rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                navigate('/agent-dashboard');
                if (sidebarOpen) toggleSidebar();
              }}
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText
                primary="AGENT DASHBOARD"
                primaryTypographyProps={{
                  fontSize: "0.8125rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Box>

      {/* Utilities Section */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", pt: sidebarOpen ? 2 : 0 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText
                primary="LOG IN"
                primaryTypographyProps={{
                  fontSize: "0.8125rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText
                primary="SEARCH"
                primaryTypographyProps={{
                  fontSize: "0.8125rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#fff",
          color: "#000",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleSidebar}
            sx={{ 
              mr: 2,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          {/* Logo in AppBar - Only show when sidebar is closed */}
          {!sidebarOpen && (
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                mr: 2,
              }}
            >
              <img
                src="https://www.metlife.com/content/dam/metlifecom/us/icons-header/MetLife.png"
                alt="MetLife"
                onError={() => handleImageError('appbar')}
                onLoad={() => {
                  setImageError((prev) => ({ ...prev, appbar: false }));
                }}
                style={{
                  height: '30px',
                  display: imageError.appbar ? 'none' : 'block',
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
              />
              {imageError.appbar && (
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "#000",
                    fontSize: "1rem",
                  }}
                >
                  MetLife
                </Typography>
              )}
            </Box>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", sm: "flex" } }}>
            <Button
              startIcon={<PersonIcon />}
              sx={{
                color: "inherit",
                textTransform: "uppercase",
                fontSize: "0.8125rem",
                letterSpacing: "0.6px",
                fontWeight: 400,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              LOG IN
            </Button>
            <IconButton
              color="inherit"
              aria-label="search"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Left Sidebar Drawer */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? drawerWidth : 0,
          flexShrink: 0,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #e6e6e6",
            backgroundColor: "#fff",
            top: 64,
            height: "calc(100% - 64px)",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: "hidden",
            color: "#000",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Navbar;