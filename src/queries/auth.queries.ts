import { SignInWithMagicLink } from "@/services/SignInWithMagicLink.service";
import { supabase } from "@/supabase-client";
import { useMutation } from "@tanstack/react-query";

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
