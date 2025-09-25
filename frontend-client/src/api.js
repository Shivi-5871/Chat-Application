import axios from "axios";

// Use proxy in dev, full URL in production
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
});

export default API;