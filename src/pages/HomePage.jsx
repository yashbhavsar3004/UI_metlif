import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Stack,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import {
  Security,
  HealthAndSafety,
  Business,
  TrendingUp,
  People,
  Public,
  Shield,
  Support,
  School,
  Work,
  Home,
  AccountBalance,
} from "@mui/icons-material";

const HomePage = ({ sidebarOpen = false }) => {
  const services = [
    {
      icon: <HealthAndSafety sx={{ fontSize: 48 }} />,
      title: "Life Insurance",
      description:
        "Protect your loved ones with comprehensive life insurance coverage tailored to your needs.",
      color: "#F44336", // Red
    },
    {
      icon: <Home sx={{ fontSize: 48 }} />,
      title: "Home & Auto Insurance",
      description:
        "Safeguard your home and vehicles with reliable insurance solutions.",
      color: "#4CAF50", // Green
    },
    {
      icon: <Work sx={{ fontSize: 48 }} />,
      title: "Employee Benefits",
      description:
        "Comprehensive benefits solutions for businesses of all sizes.",
      color: "#2196F3", // Blue
    },
    {
      icon: <Business sx={{ fontSize: 48 }} />,
      title: "Retirement & Investments",
      description:
        "Plan for your future with retirement savings and investment options.",
      color: "#F44336", // Red
    },
    {
      icon: <AccountBalance sx={{ fontSize: 48 }} />,
      title: "Dental & Vision",
      description:
        "Affordable dental and vision coverage to keep you and your family healthy.",
      color: "#4CAF50", // Green
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: "Disability Insurance",
      description:
        "Income protection for when you can't work due to illness or injury.",
      color: "#2196F3", // Blue
    },
  ];

  const values = [
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: "Customer-Centric",
      description: "Putting customers first in everything we do",
    },
    {
      icon: <Shield sx={{ fontSize: 40 }} />,
      title: "Trust & Reliability",
      description: "Over 155 years of financial stability",
    },
    {
      icon: <Public sx={{ fontSize: 40 }} />,
      title: "Global Reach",
      description: "Serving millions worldwide",
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      title: "Expert Support",
      description: "Dedicated team ready to help",
    },
  ];

  const stats = [
    { number: "90M+", label: "Customers Worldwide" },
    { number: "155+", label: "Years of Experience" },
    { number: "60+", label: "Countries Served" },
    { number: "$600B+", label: "Assets Under Management" },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #F44336 100%)", // Blue to Red gradient
          color: "white",
          py: { xs: 8, md: 12 },
          mb: 6,
          borderRadius: 0,
          mx: { xs: 0, sm: sidebarOpen ? 0 : 0 },
        }}
      >
        <Container 
          maxWidth="lg"
          sx={{
            px: { xs: 2, sm: 3, md: sidebarOpen ? 2 : 4 },
          }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2rem", md: "3.5rem" },
                  mb: 2,
                }}
              >
                Building Brighter Futures Together
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  lineHeight: 1.6,
                }}
              >
                MetLife is a leading global financial services company providing
                insurance, annuities, employee benefits, and asset management
                to help customers achieve their financial goals.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => window.location.href = "https://www.metlife.com/get-started/"}
                  sx={{
                    backgroundColor: "white",
                    color: "#2196F3", // Blue
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => window.location.href = "https://www.metlife.com/about/"}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  textAlign: "center",
                  mt: { xs: 4, md: 0 },
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  90M+
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Customers Trust MetLife
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container 
        maxWidth="lg"
        sx={{
          px: { xs: 2, sm: 3, md: sidebarOpen ? 2 : 4 },
        }}
      >
        {/* Stats Section */}
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 8 }}>
          {stats.map((stat, index) => {
            // Alternate colors: Blue, Green, Red, Blue
            const colors = ["#2196F3", "#4CAF50", "#F44336", "#2196F3"]; // Blue, Green, Red, Blue
            const color = colors[index % colors.length];
            return (
              <Grid item xs={6} md={3} key={index}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    borderRadius: 2,
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: color,
                      mb: 1,
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {/* About Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
          >
            About MetLife
          </Typography>
          <Divider sx={{ mb: 4, width: 100, mx: "auto", height: 3 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                MetLife, Inc. is one of the world's leading financial services
                companies, providing insurance, annuities, employee benefits, and
                asset management. We are committed to helping our customers
                achieve their financial goals and build brighter futures.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                Founded in 1868, MetLife has grown to serve over 90 million
                customers across more than 60 countries. Our global presence and
                extensive experience make us a trusted partner for individuals,
                families, and businesses worldwide.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Our Commitment
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                At MetLife, we believe that everyone deserves financial security
                and peace of mind. We work tirelessly to provide innovative
                solutions that protect what matters most to our customers.
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
                <Chip
                  label="Financial Stability"
                  sx={{ backgroundColor: "#F44336", color: "white" }}
                  icon={<TrendingUp />}
                />
                <Chip
                  label="Global Presence"
                  sx={{ backgroundColor: "#4CAF50", color: "white" }}
                  icon={<Public />}
                />
                <Chip
                  label="Innovation"
                  sx={{ backgroundColor: "#2196F3", color: "white" }}
                  icon={<School />}
                />
                <Chip
                  label="Customer Focus"
                  sx={{ backgroundColor: "#F44336", color: "white" }}
                  icon={<People />}
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Services Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
          >
            Our Products & Services
          </Typography>
          <Divider sx={{ mb: 4, width: 100, mx: "auto", height: 3 }} />
          <Grid container spacing={4} justifyContent="center">
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        color: service.color,
                        mb: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600, textAlign: "center", mb: 2 }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textAlign: "center", lineHeight: 1.7, mb: 2 }}
                    >
                      {service.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        const serviceUrls = {
                          "Life Insurance": "https://www.metlife.com/life-insurance/",
                          "Home & Auto Insurance": "https://www.metlife.com/home-insurance/",
                          "Employee Benefits": "https://www.metlife.com/employee-benefits/",
                          "Retirement & Investments": "https://www.metlife.com/retirement/",
                          "Dental & Vision": "https://www.metlife.com/dental-insurance/",
                          "Disability Insurance": "https://www.metlife.com/disability-insurance/"
                        };
                        window.location.href = serviceUrls[service.title] || "https://www.metlife.com/";
                      }}
                      sx={{ width: "100%" }}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Values Section */}
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
          >
            Why Choose MetLife
          </Typography>
          <Divider sx={{ mb: 4, width: 100, mx: "auto", height: 3 }} />
          <Grid container spacing={4} justifyContent="center">
            {values.map((value, index) => {
              // Alternate colors: Red, Green, Blue, Red
              const colors = ["#F44336", "#4CAF50", "#2196F3", "#F44336"]; // Red, Green, Blue, Red
              const iconColor = colors[index % colors.length];
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box
                    sx={{
                      textAlign: "center",
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                      height: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        color: iconColor,
                        mb: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {value.icon}
                    </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {value.title}
                  </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #2196F3 0%, #1976D2 50%, #F44336 100%)", // Blue to Red gradient
            color: "white",
            p: 6,
            borderRadius: 0,
            textAlign: "center",
            mb: 6,
          }}
        >
          <Container 
            maxWidth="lg"
            sx={{
              px: { xs: 2, sm: 3, md: sidebarOpen ? 2 : 4 },
            }}
          >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Ready to Build Your Brighter Future?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
            Get in touch with our team to learn more about how MetLife can help
            you achieve your financial goals.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => window.location.href = "https://www.metlife.com/contact-us/"}
              sx={{
                backgroundColor: "white",
                color: "#2196F3", // Blue
                fontWeight: 600,
                px: 4,
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              Contact Us
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => window.location.href = "https://www.metlife.com/find-an-agent/"}
              sx={{
                borderColor: "white",
                color: "white",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Find an Agent
            </Button>
          </Stack>
          </Container>
        </Box>

        {/* Footer Info */}
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            MetLife, Inc. | Serving customers since 1868 | Global Financial
            Services Leader
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            For more information, visit{" "}
            <Typography
              component="a"
              href="https://www.metlife.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#2196F3", // Blue
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              www.metlife.com
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;

