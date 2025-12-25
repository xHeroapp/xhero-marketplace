import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPBASE_FUNCTION_API_URL,
});
