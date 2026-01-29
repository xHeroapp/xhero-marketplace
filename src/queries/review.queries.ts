import { supabase } from "@/supabase-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Fetch reviews for a product
export const useGetProductReviews = (productId: string) => {
    return useQuery({
        queryKey: ["get-product-reviews", productId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("reviews")
                .select("*, user:users(full_name, avatar_url)")
                .eq("product_id", productId)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!productId,
    });
};

// Check if user has verified purchase
export const useCheckVerifiedPurchase = (productId: string) => {
    return useQuery({
        queryKey: ["check-verified-purchase", productId],
        queryFn: async () => {
            const { data, error } = await supabase.rpc("check_verified_purchase", {
                check_product_id: productId,
            });

            if (error) throw error;
            return data;
        },
        enabled: !!productId,
        retry: false,
    });
};

// Add a review
export const useAddProductReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            productId,
            rating,
            comment,
        }: {
            productId: string;
            rating: number;
            comment: string;
        }) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const { data, error } = await supabase
                .from("reviews")
                .insert({
                    user_id: user.id,
                    product_id: productId,
                    rating,
                    comment,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["get-product-reviews", variables.productId],
            });
            toast.success("Review submitted successfully!");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to submit review");
        },
    });
};
