import { SignInWithMagicLink } from "@/services/SignInWithMagicLink.service";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/supabase-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLogin = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await supabase.rpc("check_employee_email", {
        p_email: email,
      });
      console.log(data);

      if (data !== true) {
        throw new Error("Employee not found");
      }

      // send magic link / otp
      const { data: authData, error } = await SignInWithMagicLink(email);
      console.log(authData);

      if (error) throw error;
      return authData;
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

// Update user information
export const UpdateProfile = () => {
  return useMutation({
    mutationFn: async (user_data) => {
      const { user_id, ...rest } = user_data;
      console.log(rest);
      console.log(user_id);

      const { data, error } = await supabase
        .from("employees")
        .update(rest)
        .eq("id", user_id)
        .select();

      if (error) throw error;

      return data;
    },
  });
};

// Get user
export const useGetUser = () => {
  const { user, setUser } = useAuthStore();

  return useQuery({
    queryKey: ["get-user", user?.id],
    queryFn: async () => {
      const { data: employee, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      // Sync Zustand store with fetched user
      setUser(employee);

      return employee;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    // enabled: !!user?.id, // only fetch if userId exists
  });
};

export const UseUpdateLastSeen = () => {
  return useMutation({
    mutationFn: async () =>{
      const {data, error} = await supabase.rpc("update_employee_last_seen")

      if(error) {
        throw error
      }
      return data
    }
  })
}