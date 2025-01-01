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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPatient, setCurrentPatient] = useState({
    patient_id: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    phone_number: "",
    email: "",
    address: "",
  });

  const [error, setError] = useState('');

  // Fetch patients data from the API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/patients");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []); // Empty dependency array to fetch once when the component mounts

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setIsEditing(true);
      setCurrentPatient(patient);
    } else {
      setIsEditing(false);
      setCurrentPatient({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        gender: "",
        phone_number: "",
        email: "",
        address: "",
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPatient({ ...currentPatient, [name]: value });
  };

  const handleSavePatient = async () => {
    const { first_name, last_name, date_of_birth, email, phone_number, address, patient_id } = currentPatient;

    // Validate required fields
    if (!first_name || !last_name || !date_of_birth || !email || !address) {
      setError('First Name, Last Name, Date of Birth, and Email are mandatory fields.');
      return;
    }

    setError(''); // Clear error if validation is passed

    const patientData = { first_name, last_name, date_of_birth, gender: currentPatient.gender, phone_number, email, address };

    try {
      if (isEditing) {
        // Update patient
        const response = await fetch(`http://localhost:3000/api/patients/${patient_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientData),
        });
        if (response.ok) {
          setPatients(patients.map((patient) => (patient.patient_id === patient_id ? currentPatient : patient)));
        } else {
          console.error("Failed to update patient.");
        }
      } else {
        // Create new patient
        const response = await fetch("http://localhost:3000/api/patients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientData),
        });
        if (response.ok) {
          const newPatient = await response.json();
          setPatients([...patients, { ...patientData, patient_id: newPatient.patient_id }]);
        } else {
          console.error("Failed to create patient.");
        }
      }
    } catch (error) {
      console.error("Error saving patient:", error);
    }

    setCurrentPatient({
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      phone_number: "",
      email: "",
      address: "",
    });
    handleCloseModal();
  };

  const handleDeletePatient = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/patients/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPatients(patients.filter((patient) => patient.patient_id !== id));
      } else {
        console.error("Failed to delete patient.");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3, mb: 3 }}>
        Patients List
      </Typography>

      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => handleOpenModal()} sx={{ mb: 3 }}>
            Add Patient
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.patient_id}>
                <TableCell>{patient.first_name}</TableCell>
                <TableCell>{patient.last_name}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>
                  <Button variant="text" color="secondary" onClick={() => handleOpenModal(patient)}>
                    Edit
                  </Button>
                  <Button variant="text" color="error" onClick={() => handleDeletePatient(patient.patient_id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Add/Edit Patient */}
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
            {isEditing ? "Edit Patient" : "Add New Patient"}
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            fullWidth
            label="First Name"
            name="first_name"
            value={currentPatient.first_name}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Last Name"
            name="last_name"
            value={currentPatient.last_name}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            value={currentPatient.date_of_birth}
            onChange={handleChange}
            sx={{ mb: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={currentPatient.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
            
            required
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={currentPatient.gender}
              onChange={handleChange}
              label="Gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone_number"
            value={currentPatient.phone_number}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={currentPatient.address}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <Button variant="contained" onClick={handleSavePatient} sx={{ mr: 2 }}>
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

export default PatientsList;
