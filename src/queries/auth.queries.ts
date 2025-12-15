import { SignInWithMagicLink } from "@/services/SignInWithMagicLink.service";
import { supabase } from "@/supabase-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data: employee, error: employeeCheckError } = await supabase
        .from("employees")
        .select("*")
        .eq("email", email)
        .single();

      if (!employee) {
        throw employeeCheckError;
      }

      // send magic link / otp
      const { data, error } = await SignInWithMagicLink(email);

      if (error) {
        throw error;
      }
      return data;
    },
  });
};

// Log out
export const Logout = async () => {
  const SignOut = await supabase.auth.signOut();
  if (SignOut.error) {
    toast.error(`Error while trying to sign out, ${SignOut.error}`);
    throw SignOut.error;
  } else {
    toast.success(`Signed Out`);
  }
};
