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
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useSidebar } from "../contexts/SidebarContext";

export const drawerWidth = 280;

const Navbar = () => {
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const [expandedItems, setExpandedItems] = useState({});
  const [imageError, setImageError] = useState({});

  const handleImageError = (location) => {
    setImageError((prev) => ({ ...prev, [location]: true }));
  };

  const navItems = [
    {
      label: "CLAIM FORM",
      link: "/claim-form",
    },
    {
      label: "SUPPORT",
      link: "/support",
    },
    {
      label: "ABOUT US",
      subItems: ["Example link 1", "Example link 2", "Example link 3"],
    },
    {
      label: "RESOURCES",
      subItems: ["Example link 1", "Example link 2", "Example link 3"],
    },
  ];


  const handleToggleExpand = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const sidebarContent = (
    <Box sx={{ width: drawerWidth, height: "100%" }}>
      {/* Logo Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid #e6e6e6",
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
          {!imageError.sidebar ? (
            <Box
              component="img"
              src="https://www.metlife.com/content/dam/metlifecom/us/icons-header/MetLife.png"
              alt="MetLife"
              crossOrigin="anonymous"
              onError={() => handleImageError('sidebar')}
              sx={{
                height: 30,
                display: "block",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#0066cc",
                fontSize: "1.25rem",
              }}
            >
              MetLife
            </Typography>
          )}
        </Box>
        <IconButton
          onClick={toggleSidebar}
          sx={{ display: { sm: "none" } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => {
          // If item has a direct link (no sub-navigation)
          if (item.link) {
            return (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.link}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.8125rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      fontWeight: 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          }

          // If item has sub-navigation (expandable)
          const isExpanded = expandedItems[item.label];
          return (
            <React.Fragment key={item.label}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleToggleExpand(item.label)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.8125rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      fontWeight: 400,
                    }}
                  />
                  <ListItemIcon sx={{ minWidth: "auto" }}>
                    {isExpanded ? (
                      <ExpandLessIcon fontSize="small" />
                    ) : (
                      <ExpandMoreIcon fontSize="small" />
                    )}
                  </ListItemIcon>
                </ListItemButton>
              </ListItem>
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        component={Link}
                        to="#"
                        sx={{
                          pl: 4,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <ListItemText
                          primary={subItem}
                          primaryTypographyProps={{
                            fontSize: "0.875rem",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          );
        })}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Admin Dashboard Link */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/admin"
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
              primary="ADMIN DASHBOARD"
              primaryTypographyProps={{
                fontSize: "0.8125rem",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Utilities Section */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="#"
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
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component={Link}
            to="/"
            sx={{
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            {!imageError.appbar ? (
              <Box
                component="img"
                src="https://www.metlife.com/content/dam/metlifecom/us/icons-header/MetLife.png"
                alt="MetLife"
                crossOrigin="anonymous"
                onError={() => handleImageError('appbar')}
                sx={{
                  height: 30,
                  display: "block",
                  maxWidth: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#0066cc",
                  fontSize: "1rem",
                }}
              >
                MetLife
              </Typography>
            )}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", sm: "flex" } }}>
            <Button
              component={Link}
              to="#"
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
            top: 64,
            height: "calc(100% - 64px)",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: "hidden",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Navbar;
