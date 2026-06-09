import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getJobs    = ()         => axios.get(`${API}/jobs`);
export const createJob  = (data)     => axios.post(`${API}/jobs`, data);
export const updateJob  = (id, data) => axios.put(`${API}/jobs/${id}`, data);
export const deleteJob  = (id)       => axios.delete(`${API}/jobs/${id}`);