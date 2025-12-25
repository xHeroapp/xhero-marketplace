import { axiosInstance } from "@/config/axios";

export const SignInWithMagicLink = async (email: string) => {
  const SITE_URL =
    process.env.NODE_ENV === "production"
      ? "https://marketplace.getxhero.com/auth/callback"
      : "http://localhost:3000/auth/callback";

  try {
    const response = await axiosInstance.post("/sign-in-magic-link", {
      email,
      redirect_to: SITE_URL,
    });

    return {
      data: response.data.data,
      error: null,
    };
  } catch (error: any) {
    return {
      data: null,
      error,
    };
  }
};
