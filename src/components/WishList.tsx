"use client";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/authStore";
import {
  useDeleteItemWhishList,
  useGetUserWishlist,
} from "@/queries/wishlist.queries";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatCurrency";
import ImageWithFallback from "./reuseable/ImageWithFallback";
import { useAddToCart } from "@/hooks/useAddToCart";

const Wishlist = () => {
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { handleAddToCart } = useAddToCart();

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetUserWishlist(user?.user_id);

  const DeleteItem = useDeleteItemWhishList();

  function handleDeleteItem(item_id: string) {
    const promise = DeleteItem.mutateAsync(item_id);

    toast.promise(promise, {
      loading: "Removing Product...",
      success: () => {
        refetch();
        return "Product Removed from wishlist";
      },
      error: (error) => {
        return error.message;
      },
    });
  }

  useEffect(() => {
    isSuccess && console.log(data)
  }, [isSuccess])

  // flatten infinite pages
  const wishlistItems = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  );

  return (
    <>
      <HeaderTwo links="home" title="Wishlist" />

      <div className="page-content-wrapper">
        <div className="py-3">
          <div className="container">
            <div className="section-heading d-flex align-items-center justify-content-between rtl-flex-d-row-r">
              <h6>Wishlist Items</h6>

              <div className="layout-options">
                <button
                  className={viewMode === "grid" ? "active" : ""}
                  onClick={() => setViewMode("grid")}
                  style={{ border: "none", cursor: "pointer" }}
                >
                  <i className="ti ti-border-all"></i>
                </button>
                <button
                  className={viewMode === "list" ? "active" : ""}
                  onClick={() => setViewMode("list")}
                  style={{ border: "none", cursor: "pointer" }}
                >
                  <i className="ti ti-list-check"></i>
                </button>
              </div>
            </div>

            {/* Loading */}
            {isLoading && <p>Loading wishlist...</p>}

            {/* Error */}
            {isError && <p>Failed to load wishlist</p>}

            {/* Empty */}
            {!isLoading && wishlistItems.length === 0 && (
              <p>No items in your wishlist</p>
            )}

            {/* GRID VIEW */}
            {viewMode === "grid" && wishlistItems.length > 0 && (
              <div className="row g-2 rtl-flex-d-row-r">
                {wishlistItems.map((item) => (
                  <div key={item.wishlist_id} className="col-6 col-md-4">
                    <div className="card product-card">
                      <div className="card-body">
                        <div
                          className="delete-btn"
                          onClick={() => handleDeleteItem(item.wishlist_id)}
                        >
                          <i className="ti ti-trash text-danger"></i>
                        </div>

                        <Link
                          className="product-thumbnail d-block"
                          href={`/product/${item.vendor_product_id}`}
                        >
                          <ImageWithFallback
                            src={item.image_url}
                            alt={item.product_name}
                          />
                        </Link>

                        <Link
                          className="product-title"
                          href={`/product/${item.vendor_product_id}`}
                        >
                          {item.product_name}
                        </Link>

                        <p className="sale-price">
                          {formatCurrency(item.price)}
                        </p>

                        <button
                          className="btn btn-primary btn-add-cart mt-2"
                          onClick={
                            () => handleAddToCart(item) // passing the full wishlist to the cart cause it contains the same data the cart needs
                          }
                          disabled={isLoading}
                        >
                          <i className="ti ti-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load more */}
                {hasNextPage && (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 mt-2"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? "Loading..." : "Load more"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* LIST VIEW */}
            {viewMode === "list" && wishlistItems.length > 0 && (
              <div className="row g-2">
                {wishlistItems.map((item) => (
                  <div key={item.wishlist_id} className="col-12">
                    <div className="card horizontal-product-card">
                      <div className="d-flex align-items-center">
                        <div className="product-thumbnail-side">
                          <Link
                            className="product-thumbnail d-block"
                            href={`/product/${item.vendor_product_id}`}
                          >
                            <ImageWithFallback
                              src={item.image_url}
                              alt={item.product_name}
                            />
                            {/* <img src={item.image_url} alt={item.product_name} /> */}
                          </Link>
                          <div
                            className="delete-btn"
                            onClick={() => handleDeleteItem(item.wishlist_id)}
                          >
                            <i className="ti ti-trash text-danger"></i>
                          </div>
                        </div>

                        <div className="product-description">
                          <Link
                            className="product-title d-block"
                            href={`/product/${item.vendor_product_id}`}
                          >
                            {item.product_name}
                          </Link>

                          <p className="sale-price">
                            {formatCurrency(item.price)}
                          </p>

                          <button
                            className="btn btn-primary btn-add-cart"
                            onClick={
                              () => handleAddToCart(item) // passing the full wishlist to the cart cause it contains the same data the cart needs
                            }
                            disabled={isLoading}
                          >
                            Add to Cat
                            {/* <i className="ti ti-plus"></i> */}
                          </button>

                          {/* <small className="text-muted">
                            {item.vendor_name}
                          </small> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {hasNextPage && (
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 mt-2"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? "Loading..." : "Load more"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Wishlist;
