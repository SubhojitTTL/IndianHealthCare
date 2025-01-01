import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Box,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, name: "John Doe", date: "2024-01-15", time: "10:00 AM", doctor: "Dr. Smith", status: "Scheduled" },
    { id: 2, name: "Jane Roe", date: "2024-01-16", time: "11:30 AM", doctor: "Dr. Brown", status: "Scheduled" },
    { id: 3, name: "Emily Davis", date: "2024-01-15", time: "01:00 PM", doctor: "Dr. Smith", status: "Scheduled" },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track whether we're editing
  const [currentAppointment, setCurrentAppointment] = useState({
    name: "",
    date: "",
    time: "",
    doctor: "",
    status: "Scheduled", // Default status
  });

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [viewByDoctor, setViewByDoctor] = useState(false);

  // Get today's date in 'YYYY-MM-DD' format
  function getCurrentDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  useEffect(() => {
    // Set selected date to today when the component is first loaded
    setSelectedDate(getCurrentDate());
  }, []);

  const handleOpenModal = (appointment = null) => {
    if (appointment) {
      setIsEditing(true);
      setCurrentAppointment(appointment);
    } else {
      setIsEditing(false);
      setCurrentAppointment({ name: "", date: "", time: "", doctor: "", status: "Scheduled" });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAppointment({ ...currentAppointment, [name]: value });
  };

  const handleSaveAppointment = () => {
    if (isEditing) {
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === currentAppointment.id ? currentAppointment : appointment
        )
      );
    } else {
      setAppointments([ ...appointments, { id: Date.now(), ...currentAppointment } ]);
    }
    setCurrentAppointment({ name: "", date: "", time: "", doctor: "", status: "Scheduled" });
    handleCloseModal();
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const toggleView = () => {
    setViewByDoctor(!viewByDoctor);
  };

  // Filter appointments by selected date
  const filteredAppointments = appointments.filter(
    (appointment) => appointment.date === selectedDate
  );

  // Group appointments by doctor
  const groupedByDoctor = filteredAppointments.reduce((acc, appointment) => {
    if (!acc[appointment.doctor]) {
      acc[appointment.doctor] = [];
    }
    acc[appointment.doctor].push(appointment);
    return acc;
  }, {});

  // Function to check if a selected date is in the future
  const isFutureDate = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    return selectedDate > today;
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
        Appointments
      </Typography>

      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()} sx={{ mb: 3 }}>
            Add Appointment
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={toggleView} sx={{ mb: 3 }}>
            {viewByDoctor ? "Switch to Date View" : "Switch to Doctor View"}
          </Button>
        </Grid>
      </Grid>

      <TextField
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        label="Select Date"
        sx={{ mb: 3 }}
        InputLabelProps={{
          shrink: true,
        }}
      />

      {viewByDoctor ? (
        // Doctor Level View: Grouped by doctor
        <div>
          {Object.keys(groupedByDoctor).map((doctor) => (
            <div key={doctor}>
              <Typography variant="h6">{doctor}</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient Name</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedByDoctor[doctor].map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.name}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>{appointment.status}</TableCell>
                        <TableCell>
                          <Button variant="text" color="secondary" onClick={() => handleOpenModal(appointment)}>
                            Edit
                          </Button>
                          <Button variant="text" color="error" onClick={() => handleDeleteAppointment(appointment.id)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ))}
        </div>
      ) : (
        // Date Level View: Show appointments for the selected date
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Doctor</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.name}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.doctor}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>
                    <Button variant="text" color="secondary" onClick={() => handleOpenModal(appointment)}>
                      Edit
                    </Button>
                    <Button variant="text" color="error" onClick={() => handleDeleteAppointment(appointment.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {isEditing ? "Edit Appointment" : "Add New Appointment"}
          </Typography>
          <TextField
            fullWidth
            label="Patient Name"
            name="name"
            value={currentAppointment.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="date"
            name="date"
            value={currentAppointment.date}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="time"
            name="time"
            value={currentAppointment.time}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Doctor"
            name="doctor"
            value={currentAppointment.doctor}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={currentAppointment.status}
              onChange={handleChange}
            >
              <MenuItem value="Scheduled">Scheduled</MenuItem>
              <MenuItem value="Visited">Visited</MenuItem>
              <MenuItem value="Canceled">Canceled</MenuItem>
              <MenuItem value="Rescheduled">Rescheduled</MenuItem>
            </Select>
          </FormControl>
          {currentAppointment.status === "Rescheduled" && (
            <TextField
              fullWidth
              type="date"
              name="date"
              label="New Date"
              value={currentAppointment.date}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
              error={!isFutureDate(currentAppointment.date)}
              helperText={!isFutureDate(currentAppointment.date) ? "Please select a future date" : ""}
            />
          )}
          <Button variant="contained" onClick={handleSaveAppointment} sx={{ mr: 2 }}>
            {isEditing ? "Save Changes" : "Save"}
          </Button>
          <Button variant="outlined" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default Appointments;
