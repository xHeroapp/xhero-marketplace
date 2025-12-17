"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetProductItems } from "@/queries/products.queries";
import { useDebounce } from "@/hooks/useDebounce";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch products based on search term
  const { data, isLoading } = useGetProductItems(
    { search: debouncedSearchTerm },
    10 // Limit to 10 results for dropdown
  );

  // Get products from the first page
  const searchResults = data?.pages[0]?.items || [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown when there are results and search term is not empty
  useEffect(() => {
    if (debouncedSearchTerm.trim() !== "" && searchResults.length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  }, [debouncedSearchTerm, searchResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleProductClick = (vendorProductId: string) => {
    setSearchTerm("");
    setIsDropdownOpen(false);
    router.push(`/product/${vendorProductId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleProductClick(searchResults[0].vendor_product_id);
    }
  };

  if (typeof window !== "undefined") {
    require("bootstrap/dist/js/bootstrap");
  }

  return (
    <div className="container">
      <div className="search-form pt-3 position-relative" ref={searchRef}>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control"
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <button type="submit">
            <i className="ti ti-search"></i>
          </button>
        </form>

        {/* Dropdown Results */}
        {isDropdownOpen && (
          <div className="search-dropdown">
            {isLoading ? (
              <div className="search-dropdown-item loading">
                <div
                  className="spinner-border spinner-border-sm text-primary me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span>Searching...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                {searchResults.map((product) => (
                  <div
                    key={product.vendor_product_id}
                    className="search-dropdown-item"
                    onClick={() =>
                      handleProductClick(product.vendor_product_id)
                    }
                  >
                    <i className="ti ti-package me-2"></i>
                    <span>{product.product_name}</span>
                  </div>
                ))}
              </>
            ) : debouncedSearchTerm.trim() !== "" ? (
              <div className="search-dropdown-item no-results">
                <i className="ti ti-search-off me-2"></i>
                <span>No products found</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <style jsx>{`
        .search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
        }

        .search-dropdown-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #f8f9fa;
        }

        .search-dropdown-item:last-child {
          border-bottom: none;
        }

        .search-dropdown-item:hover {
          background-color: #f8f9fa;
        }

        .search-dropdown-item.loading,
        .search-dropdown-item.no-results {
          cursor: default;
          color: #6c757d;
        }

        .search-dropdown-item.loading:hover,
        .search-dropdown-item.no-results:hover {
          background-color: white;
        }

        .search-dropdown-item i {
          font-size: 1.1rem;
          color: #6c757d;
        }

        .search-dropdown-item span {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .search-dropdown::-webkit-scrollbar {
          width: 6px;
        }

        .search-dropdown::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 0.5rem;
        }

        .search-dropdown::-webkit-scrollbar-thumb {
          background: #dee2e6;
          border-radius: 0.5rem;
        }

        .search-dropdown::-webkit-scrollbar-thumb:hover {
          background: #adb5bd;
        }
      `}</style>
    </div>
  );
};

export default Search;
