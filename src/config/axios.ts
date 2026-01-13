import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_FUNCTION_API_URL,
});
