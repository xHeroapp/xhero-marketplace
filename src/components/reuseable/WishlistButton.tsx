"use client";
import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useWishlistMap, useAddToWishListQuery, useDeleteItemWhishList } from "@/queries/wishlist.queries";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface WishlistButtonProps {
    vendorProductId: string;
    className?: string;
}

const WishlistButton = ({ vendorProductId, className = "wishlist-btn" }: WishlistButtonProps) => {
    const { user } = useAuthStore();
    const userId = user?.user_id;
    const queryClient = useQueryClient();

    // Use the efficient bulk lookup map
    const { data: wishlistMap } = useWishlistMap(userId);
    const wishlistId = wishlistMap?.get(vendorProductId);

    const addMutation = useAddToWishListQuery();
    const deleteMutation = useDeleteItemWhishList();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!userId) {
            toast.error("Please login to use wishlist");
            return;
        }

        if (wishlistId) {
            // Remove from wishlist
            const promise = deleteMutation.mutateAsync(wishlistId).then(() => {
                // Invalidate the map so all buttons update instantly
                queryClient.invalidateQueries({ queryKey: ["user-wishlist-map", userId] });
                // Also invalidate the main wishlist page list
                queryClient.invalidateQueries({ queryKey: ["user-wishlist", userId] });
            });

            toast.promise(promise, {
                loading: "Removing from wishlist...", // Keeping original typo if desired, but let's fix it silently "from"
                success: "Removed from wishlist",
                error: "Error removing from wishlist",
            });
        } else {
            // Add to wishlist
            const promise = addMutation.mutateAsync({
                user_id: userId,
                vendor_product_id: vendorProductId,
            }).then(() => {
                queryClient.invalidateQueries({ queryKey: ["user-wishlist-map", userId] });
                queryClient.invalidateQueries({ queryKey: ["user-wishlist", userId] });
            });

            toast.promise(promise, {
                loading: "Adding to wishlist...",
                success: "Added to wishlist",
                error: (err: any) => {
                    if (err.code === "23505") {
                        return "Already in wishlist";
                    }
                    return err.message;
                },
            });
        }
    };

    const isInWishlist = !!wishlistId;

    return (
        <div onClick={handleClick} className={className} style={{ cursor: "pointer" }}>
            <i className={isInWishlist ? "ti ti-heart-filled text-danger" : "ti ti-heart"}></i>
        </div>
    );
};

export default WishlistButton;
