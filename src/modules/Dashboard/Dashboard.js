import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const Dashboard = () => {
  const stats = [
    { title: "Total Appointments", value: 120 },
    { title: "Active Patients", value: 80 },
    { title: "Pending Invoices", value: 10 },
  ];

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{stat.title}</Typography>
                <Typography variant="h4">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;
