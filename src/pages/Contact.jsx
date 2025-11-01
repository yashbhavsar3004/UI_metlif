import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Stack,
} from "@mui/material";
import { ContactMail, Phone, LocationOn } from "@mui/icons-material";

const Contact = ({ sidebarOpen = false }) => {
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
        sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
      >
        Contact Us
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Send us a Message
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                type="email"
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                type="tel"
              />
              <TextField
                fullWidth
                label="Subject"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Message"
                variant="outlined"
                multiline
                rows={4}
                required
              />
              <Button
                variant="contained"
                size="large"
                sx={{ py: 1.5, mt: 2 }}
              >
                Send Message
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ContactMail sx={{ fontSize: 40, color: "#2196F3", mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Email Us
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                customerservice@metlife.com
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                We'll respond within 24 hours
              </Typography>
            </Paper>

            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Phone sx={{ fontSize: 40, color: "#4CAF50", mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Call Us
                </Typography>
              </Box>
              <Typography variant="h6" color="primary">
                1-800-METLIFE
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Monday - Friday, 8 AM - 8 PM EST
              </Typography>
            </Paper>

            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationOn sx={{ fontSize: 40, color: "#F44336", mr: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Visit Us
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                MetLife, Inc.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                200 Park Avenue
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New York, NY 10166
              </Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contact;

