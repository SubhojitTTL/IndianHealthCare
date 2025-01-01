import axios from "axios";

export const getAppointments = async () => {
  const response = await axios.get("/api/appointments");
  return response.data;
};
