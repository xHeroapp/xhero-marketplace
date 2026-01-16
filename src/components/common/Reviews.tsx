"use client";
import {
    useAddProductReview,
    useCheckVerifiedPurchase,
    useGetProductReviews,
} from "@/queries/review.queries";
import { format } from "date-fns"; // ensure date-fns is installed or use JS Date
import React, { useState } from "react";
import ReactStars from "react-rating-stars-component"; // assuming this or similar exists, or roll custom stars

const Reviews = ({ productId }: { productId: string }) => {
    const { data: reviews, isLoading } = useGetProductReviews(productId);
    const { data: canReview } = useCheckVerifiedPurchase(productId);
    const addReviewMutation = useAddProductReview();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        addReviewMutation.mutate(
            { productId, rating, comment },
            {
                onSuccess: () => {
                    setComment("");
                    setRating(5);
                },
            }
        );
    };

    if (isLoading) return <div>Loading reviews...</div>;

    return (
        <>
            <div className="rating-and-review-wrapper bg-white py-3 mb-3 dir-rtl">
                <div className="container">
                    <h6>Ratings & Reviews ({reviews?.length || 0})</h6>
                    <div className="rating-review-content">
                        <ul className="ps-0">
                            {reviews?.map((item: any) => (
                                <li key={item.id} className="single-user-review d-flex">
                                    <div className="user-thumbnail">
                                        <img
                                            src={
                                                item.user?.avatar_url || "/assets/img/user.png" // Fallback avatar
                                            }
                                            alt=""
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                    <div className="rating-comment">
                                        <div className="rating">
                                            {[...Array(5)].map((_, i) => (
                                                <i
                                                    key={i}
                                                    className={`ti ti-star-filled ${i < item.rating ? "text-warning" : "text-muted"
                                                        }`}
                                                ></i>
                                            ))}
                                        </div>
                                        <p className="comment mb-0">{item.comment}</p>
                                        <span className="name-date">
                                            {item.user?.first_name || "User"} •{" "}
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </li>
                            ))}
                            {reviews?.length === 0 && (
                                <li className="text-muted">No reviews yet.</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {canReview && (
                <div className="ratings-submit-form bg-white py-3 dir-rtl">
                    <div className="container">
                        <h6>Submit A Review</h6>
                        <form onSubmit={handleSubmit}>
                            <div className="stars mb-3">
                                <div className="d-flex align-items-center">
                                    <span className="me-2">Your Rating:</span>
                                    <div className="rating-input d-flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i
                                                key={star}
                                                className={`ti ti-star-filled fs-4 ${star <= rating ? "text-warning" : "text-muted"}`}
                                                onClick={() => setRating(star)}
                                                style={{ cursor: "pointer", marginRight: "2px" }}
                                            ></i>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <textarea
                                className="form-control mb-3"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                placeholder="Write your review..."
                                required
                            ></textarea>
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={addReviewMutation.isPending}
                            >
                                {addReviewMutation.isPending ? "Submitting..." : "Save Review"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Reviews;
