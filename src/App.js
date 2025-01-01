import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PatientsList from "./modules/Appointments/pages/PatientListPage"; // Make sure to import your PatientsList component
import DoctorList from "./modules/Doctors/pages/DoctorListPage"; // Make sure to import your PatientsList component
import SpecialtiesPage from "./modules/Doctors/pages/SpecialtiesPage"; // Make sure to import your PatientsList component

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Patients List */}
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/Specialties" element={<SpecialtiesPage />} />
        {/* Optionally, you can add more routes here, e.g., a home route */}
        <Route path="/" element={<div>Welcome to the Healthcare Management System</div>} />
      </Routes>
    </Router>
  );
}

export default App;
