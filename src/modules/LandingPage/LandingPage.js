import React from "react";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";

const LandingPage = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Healthcare SaaS
          </Typography>
          <Button color="inherit" href="/login">
            Login
          </Button>
          <Button color="inherit" href="/signup">
            Signup
          </Button>
        </Toolbar>
      </AppBar>

      <Container>
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <Typography variant="h3" gutterBottom>
            Welcome to Healthcare SaaS
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Appointment Management & CRM Tool for Healthcare
          </Typography>
          <Button variant="contained" color="primary" href="/dashboard" sx={{ mt: 3 }}>
            Get Started
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default LandingPage;
