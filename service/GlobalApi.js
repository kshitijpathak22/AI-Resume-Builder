import axios from "axios";
import React from "react";


const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

// Create an axios instance with default configuration
const axiosClient = axios.create({
  baseURL: 'http://localhost:1337/api/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

// Function to create a new resume
const CreateNewResume = (data) => axiosClient.post('/user-resumes', data);

const GetUserResumes =(userEmail) => axiosClient.get('/user-resumes?filters[userEmail][$eq]='+userEmail);

const updateResumeDetail = (id, data) => {
  return axiosClient.put(`/user-resumes/${id}`, data)
    .catch(error => {
      console.error('Update error:', error.response?.data || error);
      throw error;
    });
};

export default {
  CreateNewResume,
  GetUserResumes,
  updateResumeDetail
};
