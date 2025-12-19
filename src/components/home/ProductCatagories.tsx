"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useGetProductCategories } from "@/queries/products.queries";
import { useSortedCategories } from "@/hooks/useSortedCategories";
import { useCategoryStore } from "@/store/categoryStore";

const ProductCatagories = () => {
  const [active, setActive] = useState();
  const { categories, loading, error } = useCategoryStore();

  const { sortedCategories } = useSortedCategories(categories);
  // data fetching (queries)
  const ProductCategoriesQuery = useGetProductCategories();

  // Sort categories to put "Others" at the end
  // const sortedCategories = React.useMemo(() => {
  //   if (!ProductCategoriesQuery.data) return [];

  //   const categories = [...ProductCategoriesQuery.data];
  //   return categories.sort((a, b) => {
  //     const aIsOthers = a.name.toLowerCase() === "others";
  //     const bIsOthers = b.name.toLowerCase() === "others";

  //     if (aIsOthers) return 1;
  //     if (bIsOthers) return -1;
  //     return 0;
  //   });
  // }, [ProductCategoriesQuery.data]);

  // Loading state
  if (ProductCategoriesQuery.isLoading) {
    return (
      <>
        <div className="product-catagories-wrapper py-3 px-3">
          <div className="container">
            <div className="categories-scroll-container">
              <div className="categories-scroll-wrapper">
                {[...Array(1)].map((_, i) => (
                  <div key={i} className="category-item-wrapper">
                    <div className="card catagory-card">
                      <div className="card-body px-2">
                        <div className="skeleton-circle"></div>
                        <div className="skeleton-text"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (ProductCategoriesQuery.isError) {
    return (
      <div className="product-catagories-wrapper py-3">
        <div className="container">
          <div className="card border-danger">
            <div className="card-body text-center py-5">
              <i
                className="ti ti-alert-circle text-danger"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 mb-2">Unable to Load Categories</h5>
              <p className="text-muted mb-3">
                {ProductCategoriesQuery.error?.message ||
                  "Something went wrong while fetching categories."}
              </p>
              <button
                onClick={() => ProductCategoriesQuery.refetch()}
                className="btn btn-danger"
              >
                <i className="ti ti-refresh me-2"></i>Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (
    !ProductCategoriesQuery.data ||
    ProductCategoriesQuery.data.length === 0
  ) {
    return (
      <div className="product-catagories-wrapper py-3">
        <div className="container">
          <div className="card">
            <div className="card-body text-center py-5">
              <i
                className="ti ti-category text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 mb-2">No Categories Available</h5>
              <p className="text-muted mb-0">
                Product categories will appear here once they are added.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state with data
  return (
    <>
      <div className="product-catagories-wrapper py-3 px-3">
        <div className="container">
          <div className="categories-scroll-container">
            <div className="categories-scroll-wrapper">
              {sortedCategories.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className="category-item-wrapper"
                >
                  <div
                    className={`card catagory-card ${
                      active === item.id ? "active" : ""
                    }`}
                  >
                    <div className="card-body px-2">
                      <Link href={`/category?category_id=${item.id}`}>
                        <img src={item.img} alt={item.name} />
                        <span>{item.name}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .categories-scroll-container {
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .categories-scroll-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        .categories-scroll-wrapper {
          display: flex;
          gap: 0.5rem;
          padding-bottom: 0.5rem;
        }

        .category-item-wrapper {
          flex: 0 0 auto;
          width: 100px;
        }

        .category-item-wrapper .catagory-card {
          height: 100%;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .category-item-wrapper .catagory-card:hover {
          // transform: translateY(-2px);
          // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .category-item-wrapper .catagory-card.active {
          // border-color: var(--bs-primary);
          // box-shadow: 0 0 0 2px var(--bs-primary);
        }

        .category-item-wrapper .card-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .category-item-wrapper img {
          width: 50px;
          height: 50px;
          object-fit: contain;
          margin-bottom: 0.5rem;
        }

        .category-item-wrapper span {
          font-size: 0.75rem;
          line-height: 1.2;
          display: block;
          word-wrap: break-word;
          max-width: 100%;
        }
      `}</style>
    </>
  );
};

export default ProductCatagories;
