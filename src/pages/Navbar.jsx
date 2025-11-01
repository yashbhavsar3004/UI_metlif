import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEls, setAnchorEls] = useState({});

  const navItems = ["SOLUTIONS", "SUPPORT", "ABOUT US", "RESOURCES"];

  const handleToggleMobile = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleMenuOpen = (event, key) => {
    setAnchorEls((prev) => ({
      ...prev,
      [key]: event.currentTarget,
    }));
  };

  const handleMenuClose = (key) => {
    setAnchorEls((prev) => ({
      ...prev,
      [key]: null,
    }));
  };

  const renderDropdownMenu = (label, key) => {
    const anchorEl = anchorEls[key];
    const open = Boolean(anchorEl);

    return (
      <Box key={key} sx={{ position: "relative" }}>
        <Button
          onClick={(e) => handleMenuOpen(e, key)}
          endIcon={<ExpandMoreIcon />}
          sx={{
            color: "inherit",
            textTransform: "uppercase",
            fontSize: "0.8125rem",
            letterSpacing: "0.6px",
            fontWeight: 400,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            },
          }}
        >
          {label}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleMenuClose(key)}
          MenuListProps={{
            "aria-labelledby": key,
          }}
          PaperProps={{
            sx: {
              mt: 1.5,
              minWidth: 200,
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            },
          }}
        >
          <MenuItem onClick={() => handleMenuClose(key)}>
            Example link 1
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose(key)}>
            Example link 2
          </MenuItem>
          <MenuItem onClick={() => handleMenuClose(key)}>
            Example link 3
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  const mobileMenu = (
    <Box
      onClick={handleToggleMobile}
      onKeyDown={handleToggleMobile}
      sx={{ width: "auto" }}
    >
      <List>
        {navItems.map((item, index) => (
          <ListItem key={item} disablePadding>
            <ListItemButton component={Link} to="#" sx={{ py: 1.5 }}>
              <ListItemText
                primary={item}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton component={Link} to="#" sx={{ py: 1.5 }}>
            <PersonIcon sx={{ mr: 1, fontSize: "1.125rem" }} />
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
          <ListItemButton sx={{ py: 1.5 }}>
            <SearchIcon sx={{ mr: 1, fontSize: "1.125rem" }} />
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
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 56, sm: 64 },
            justifyContent: "space-between",
            py: 1,
          }}
        >
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="toggle navigation"
            edge="start"
            onClick={handleToggleMobile}
            sx={{ mr: 1, display: { md: "none" } }}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              mr: { xs: 1, sm: 2 },
            }}
          >
            <Box
              component="img"
              src="/content/dam/metlifecom/us/icons-header/MetLife.png"
              alt="MetLife"
              sx={{
                height: 36,
                display: "block",
              }}
            />
          </Box>

          {/* Logo divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: "none", sm: "block" },
              mr: 2,
              borderColor: "#e6e6e6",
            }}
          />

          {/* Desktop Navigation */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 1.5,
              alignItems: "center",
            }}
          >
            {navItems.map((item, index) => {
              const key = `section${index + 1}`;
              return renderDropdownMenu(item, key);
            })}
          </Box>

          {/* Utilities: Login + Search */}
          <Stack
            direction="row"
            spacing={1.5}
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
            }}
          >
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
                minWidth: "auto",
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
                textTransform: "uppercase",
                fontSize: "0.8125rem",
                letterSpacing: "0.6px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <SearchIcon sx={{ fontSize: "1.125rem" }} />
                <Typography
                  component="span"
                  sx={{
                    fontSize: "0.8125rem",
                    letterSpacing: "0.6px",
                    display: { xs: "none", sm: "inline" },
                  }}
                >
                  SEARCH
                </Typography>
              </Box>
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleToggleMobile}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        PaperProps={{
          sx: {
            width: { xs: "80%", sm: 280 },
            top: 64,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          },
        }}
      >
        {mobileMenu}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
