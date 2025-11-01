import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Autocomplete,
} from "@mui/material";
import { Search, Person, Phone, Email } from "@mui/icons-material";

const FindAgent = ({ sidebarOpen = false }) => {
  const [location, setLocation] = useState("");

  const agents = [
    {
      name: "John Smith",
      title: "Senior Financial Advisor",
      phone: "(555) 123-4567",
      email: "john.smith@metlife.com",
      location: "New York, NY",
      experience: "15 years",
    },
    {
      name: "Sarah Johnson",
      title: "Life Insurance Specialist",
      phone: "(555) 234-5678",
      email: "sarah.johnson@metlife.com",
      location: "Los Angeles, CA",
      experience: "10 years",
    },
    {
      name: "Michael Brown",
      title: "Retirement Planning Expert",
      phone: "(555) 345-6789",
      email: "michael.brown@metlife.com",
      location: "Chicago, IL",
      experience: "12 years",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 6,
        px: { xs: 2, sm: 3, md: sidebarOpen ? 2 : 4 },
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
      >
        Find an Agent
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Connect with a MetLife agent near you for personalized financial guidance
      </Typography>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <Autocomplete
            freeSolo
            options={["New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ"]}
            sx={{ flexGrow: 1, minWidth: 200 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Enter your location"
                placeholder="City, State or ZIP"
              />
            )}
            value={location}
            onChange={(event, newValue) => setLocation(newValue || "")}
          />
          <Button
            variant="contained"
            size="large"
            startIcon={<Search />}
            sx={{ px: 4, py: 1.5 }}
          >
            Search
          </Button>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Recommended Agents
      </Typography>

      <Grid container spacing={3}>
        {agents.map((agent, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Person sx={{ fontSize: 40, color: "#2196F3", mr: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {agent.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {agent.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Location: {agent.location}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Experience: {agent.experience}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Phone />}
                    size="small"
                    href={`tel:${agent.phone}`}
                  >
                    {agent.phone}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Email />}
                    size="small"
                    href={`mailto:${agent.email}`}
                  >
                    Email
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FindAgent;

