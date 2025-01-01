import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Grid,
  Modal,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { AddCircle as AddIcon } from '@mui/icons-material';

const SpecialtiesPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fee_range: '',
    common_conditions: '',
    subspecialties: '',
    governing_body: '',
    specialist_count: '',
    popularity: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/specialties');
      const data = await response.json();
      setSpecialties(data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const handleModalOpen = (specialty) => {
    setCurrentSpecialty(specialty);
    setFormData({
      name: specialty ? specialty.name : '',
      description: specialty ? specialty.description : '',
      fee_range: specialty ? specialty.fee_range : '',
      common_conditions: specialty && Array.isArray(specialty.common_conditions)
        ? specialty.common_conditions.join(', ')
        : specialty.common_conditions || '',
      subspecialties: specialty && Array.isArray(specialty.subspecialties)
        ? specialty.subspecialties.join(', ')
        : specialty.subspecialties || '',
      governing_body: specialty ? specialty.governing_body : '',
      specialist_count: specialty ? specialty.specialist_count : '',
      popularity: specialty ? specialty.popularity : '',
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentSpecialty(null);
    setFormData({
      name: '',
      description: '',
      fee_range: '',
      common_conditions: '',
      subspecialties: '',
      governing_body: '',
      specialist_count: '',
      popularity: '',
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const data = {
      ...formData,
      common_conditions: formData.common_conditions.split(','),
      subspecialties: formData.subspecialties.split(','),
    };

    const method = currentSpecialty ? 'PUT' : 'POST';
    const url = currentSpecialty
      ? `http://localhost:3000/api/specialties/${currentSpecialty.specialty_id}`
      : 'http://localhost:3000/api/specialties';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setSnackbarMessage(result.message);
      setSnackbarOpen(true);
      fetchSpecialties();
      handleModalClose();
    } catch (error) {
      console.error('Error saving specialty:', error);
      setSnackbarMessage('Error saving specialty');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (specialtyId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/specialties/${specialtyId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      setSnackbarMessage(result.message);
      setSnackbarOpen(true);
      fetchSpecialties();
    } catch (error) {
      console.error('Error deleting specialty:', error);
      setSnackbarMessage('Error deleting specialty');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleModalOpen(null)}
            startIcon={<AddIcon />}
          >
            Add Specialty
          </Button>
        </Grid>
        {specialties.map((specialty) => (
          <Grid item xs={12} md={6} lg={4} key={specialty.specialty_id}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{specialty.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {specialty.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  onClick={() => handleModalOpen(specialty)}
                  color="primary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(specialty.specialty_id)}
                  color="error"
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for adding/editing specialty */}
      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={{ padding: 3, maxWidth: 500, margin: 'auto', backgroundColor: 'white' }}>
          <Typography variant="h6" gutterBottom>
            {currentSpecialty ? 'Edit Specialty' : 'Add Specialty'}
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              fullWidth
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Fee Range"
              fullWidth
              value={formData.fee_range}
              onChange={(e) =>
                setFormData({ ...formData, fee_range: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Common Conditions (comma separated)"
              fullWidth
              value={formData.common_conditions}
              onChange={(e) =>
                setFormData({ ...formData, common_conditions: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Subspecialties (comma separated)"
              fullWidth
              value={formData.subspecialties}
              onChange={(e) =>
                setFormData({ ...formData, subspecialties: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Governing Body"
              fullWidth
              value={formData.governing_body}
              onChange={(e) =>
                setFormData({ ...formData, governing_body: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Specialist Count"
              fullWidth
              type="number"
              value={formData.specialist_count}
              onChange={(e) =>
                setFormData({ ...formData, specialist_count: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Popularity"
              fullWidth
              type="number"
              value={formData.popularity}
              onChange={(e) =>
                setFormData({ ...formData, popularity: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {currentSpecialty ? 'Update Specialty' : 'Add Specialty'}
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Snackbar for success or error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SpecialtiesPage;
