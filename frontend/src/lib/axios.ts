import axios from "axios";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBIC_API_URL,
  withCredentials: true,
});
