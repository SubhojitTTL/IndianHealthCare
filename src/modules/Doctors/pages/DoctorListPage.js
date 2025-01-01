import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentDoctor, setCurrentDoctor] = useState({
    doctor_id: "",
    first_name: "",
    last_name: "",
    gender: "",
    phone_number: "",
    email: "",
    address: "",
    specialty: "",
    qualification: "",
    experience: 0,
    clinic_name: "",
    clinic_timing: "",
    consultation_fee: 0,
    registration_number: "",
    aadhaar_number: "",
    date_of_birth: "",
    photo_url: "",
    created_at: "",
    updated_at: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/doctors");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/doctors/${doctorId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDoctors(doctors.filter((doctor) => doctor.doctor_id !== doctorId));
        alert("Doctor deleted successfully.");
      } else {
        console.error("Failed to delete doctor.");
        alert("Error occurred while deleting the doctor.");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
      alert("Error occurred while deleting the doctor.");
    }
  };

  const handleOpenModal = (doctor = null, mode = "edit") => {
    setViewMode(mode === "view");
    setIsEditing(mode === "edit");

    if (doctor) {
      setCurrentDoctor(doctor);
    } else {
      setCurrentDoctor({
        doctor_id: "",
        first_name: "",
        last_name: "",
        gender: "",
        phone_number: "",
        email: "",
        address: "",
        specialty: "",
        qualification: "",
        experience: 0,
        clinic_name: "",
        clinic_timing: "",
        consultation_fee: 0,
        registration_number: "",
        aadhaar_number: "",
        date_of_birth: "",
        photo_url: "",
        created_at: "",
        updated_at: "",
      });
    }

    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setViewMode(false);
    setIsEditing(false);
    setCurrentTab(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentDoctor({ ...currentDoctor, [name]: value });
  };

  const validateFields = () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "specialty",
      "qualification",
      "clinic_name",
      "gender",
      "date_of_birth",
      "aadhaar_number",
    ];

    for (let field of requiredFields) {
      if (!currentDoctor[field]) {
        setError(`The field "${field.replace(/_/g, " ")}" is mandatory.`);
        return false;
      }
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(currentDoctor.phone_number)) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(currentDoctor.email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    // Validate experience (should not be more than 50 years)
    if (currentDoctor.experience > 50) {
      setError("Experience cannot be more than 50 years.");
      return false;
    }

    // Validate Aadhaar number (12 digits)
    if (!/^\d{12}$/.test(currentDoctor.aadhaar_number)) {
      setError("Aadhaar number must be exactly 12 digits.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSaveDoctor = async () => {
    if (!validateFields()) return;

    try {
      if (isEditing) {
        const response = await fetch(`http://localhost:3000/api/doctors/${currentDoctor.doctor_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentDoctor),
        });
        if (response.ok) {
          setDoctors(doctors.map((doc) => (doc.doctor_id === currentDoctor.doctor_id ? currentDoctor : doc)));
        } else {
          console.error("Failed to update doctor.");
        }
      } else {
        const response = await fetch("http://localhost:3000/api/doctors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentDoctor),
        });
        if (response.ok) {
          const newDoctor = await response.json();
          setDoctors([...doctors, { ...currentDoctor, doctor_id: newDoctor.doctor_id }]);
        } else {
          console.error("Failed to create doctor.");
        }
      }
    } catch (error) {
      console.error("Error saving doctor:", error);
    }

    handleCloseModal();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <>
            <Grid container spacing={2} alignItems="center"> 
              <Grid item xs={6}>
                {renderDoctorField("First Name", "first_name")}
              </Grid>
              <Grid item xs={6}>
                {renderDoctorField("Last Name", "last_name")}
              </Grid>
            </Grid>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={currentDoctor.gender}
                onChange={handleChange}
                disabled={viewMode}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </>
        );
      case 1:
        return (
          <>
            {renderDoctorField("Phone Number", "phone_number", "text")}
            {renderDoctorField("Email", "email", "email")}
            {renderDoctorField("Address", "address")}
          </>
        );
      case 2:
        return (
          <>
            {renderDoctorField("Specialty", "specialty")}
            {renderDoctorField("Qualification", "qualification")}
            {renderDoctorField("Experience (Years)", "experience", "number")}
          </>
        );
      case 3:
        return (
          <>
            {renderDoctorField("Clinic Name", "clinic_name")}
            {renderDoctorField("Clinic Timing", "clinic_timing")}
            {renderDoctorField("Consultation Fee", "consultation_fee", "number")}
          </>
        );
      case 4:
        return (
          <>
            {renderDoctorField("Registration Number", "registration_number")}
            {renderDoctorField("Aadhaar Number", "aadhaar_number")}
            {renderDoctorField("Date of Birth", "date_of_birth", "date")}
          </>
        );
      default:
        return null;
    }
  };

  const renderDoctorField = (label, name, type = "text", isDisabled = false) => (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={currentDoctor[name]}
      onChange={handleChange}
      sx={{ mb: 2 }}
      type={type}
      disabled={viewMode || isDisabled}
      InputLabelProps={{
        shrink: !!currentDoctor[name] || viewMode, // Shrink label if there's data or in view mode
      }}
    />
  );

  return (
    <Container maxWidth="md">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Doctor Management
        </Typography>
        <Button variant="contained" onClick={() => handleOpenModal()} color="primary">
          Add Doctor
        </Button>
      </Box>
      <TextField
        fullWidth
        label="Search Doctor"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
      />
      <Box
  sx={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 2,
  }}
>
  {filteredDoctors.map((doctor) => (
    <Card key={doctor.doctor_id}  sx={{
      mb: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // Center content horizontally
      justifyContent: "center", // Center content vertically
      textAlign: "center", // Center-align text
      padding: 2,
    }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src={doctor.photo_url} alt={doctor.first_name} />
          <Box>
            <Typography variant="h6">
              {doctor.first_name} {doctor.last_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {doctor.specialty}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button onClick={() => handleOpenModal(doctor, "view")} color="primary">
          View
        </Button>
        <Button onClick={() => handleOpenModal(doctor, "edit")} color="primary">
          Edit
        </Button>
        <Button onClick={() => handleDeleteDoctor(doctor.doctor_id)} color="error">
          Delete
        </Button>
      </CardActions>
    </Card>
  ))}
</Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ maxWidth: "600px", margin: "auto", padding: 4, backgroundColor: "white" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {viewMode ? "View Doctor" : isEditing ? "Edit Doctor" : "Add Doctor"}
          </Typography>
          <Tabs value={currentTab} onChange={(e, value) => setCurrentTab(value)}>
            <Tab label="Basic Info" />
            <Tab label="Contact Details" />
            <Tab label="Professional Info" />
            <Tab label="Clinic Details" />
            <Tab label="Additional Info" />
          </Tabs>
          <Divider sx={{ mb: 2 }} />
          {renderTabContent()}
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            {!viewMode && (
              <Button onClick={handleSaveDoctor} color="primary" variant="contained">
                Save
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default DoctorManagement;
