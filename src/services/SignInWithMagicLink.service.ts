import { axiosInstance } from "@/config/axios";

export const SignInWithMagicLink = async (email) => {
  const SITE_URL =
    process.env.NODE_ENV === "production"
      ? "https://marketplace.getxhero.com/auth/callback" // change to xhero live url
      : "http://localhost:3000/auth/callback";
  try {
    const response = await axiosInstance.post("/sign-in-magic-link", {
      email,
      redirect_to: SITE_URL,
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
