import React from "react";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";

const MainLayout = ({ children }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Healthcare SaaS
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>{children}</Container>
    </div>
  );
};

export default MainLayout;
