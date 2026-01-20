"use client";
import { useFilters } from "@/hooks/useFilters";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useGetVendors } from "@/queries/vendors.queries";
import { useGetProductCategories } from "@/queries/products.queries";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const Vendors = () => {
  const loadMoreRef = useRef(null);

  const Filters = useFilters();

  // data fetching
  const VendorsQuery = useGetVendors(Filters);
  const ProductCategoriesQuery = useGetProductCategories();

  //   flat map the items in the pages
  const vendors = VendorsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  useEffect(() => {
    console.log(vendors);
  }, [vendors]);

  //   load more vendors on scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && VendorsQuery.hasNextPage) {
          VendorsQuery.fetchNextPage();
        }
      },
      { threshold: 1 } // trigger when 100% visible
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [VendorsQuery.hasNextPage]);

  return (
    <>
      <HeaderTwo links="shop-grid" title="Vendors" />

      <div className="page-content-wrapper py-3">
        <div className="container">
          {/* Search Input */}
          <div className="mb-3 mt-2">
            <div className="form-group position-relative">
              <i className="ti ti-search position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#747794' }}></i>
              <input
                type="text"
                className="form-control"
                placeholder="Search vendors..."
                value={Filters.searchTerm || ""}
                onChange={Filters.handleSearchChange}
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="row g-1 align-items-center rtl-flex-d-row-r mb-3">
            <div className="">
              <Swiper
                loop={true}
                slidesPerView={2.5}
                spaceBetween={5}
                className="product-catagories owl-carousel catagory-slides"
              >
                {ProductCategoriesQuery.data &&
                  ProductCategoriesQuery.data.map((item) => (
                    <SwiperSlide key={item.id}>
                      <div
                        className={`catg-btn shadow-sm ${Filters.filters.category === item.name ? 'active' : ''}`}
                        onClick={() => Filters.setCategory(item.name)}
                      >
                        {item.name}
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          </div>

          <div className="row gy-3">
            {vendors.map((vendor, i) => (
              <div key={vendor.vendor_id} className="col-12">
                {/* <!-- Single Vendor --> */}
                <div
                  className="single-vendor-wrap bg-img p-4 bg-overlay"
                  style={{
                    backgroundImage: `url(${vendor.banner_url
                      ? vendor.banner_url
                      : "/assets/img/vendor/vendor-banner.png"
                      })`,
                  }}
                >
                  <h6 className="vendor-title text-white">
                    {vendor.vendor_name}
                  </h6>
                  <div className="vendor-info">
                    <p className="mb-1 text-white">
                      <i className="ti ti-map-pin me-1"></i>
                      {vendor.address || "Location not specified"}
                    </p>
                    <div className="ratings lh-1">
                      <i className="ti ti-star-filled"></i>
                      <i className="ti ti-star-filled"></i>
                      <i className="ti ti-star-filled"></i>
                      <i className="ti ti-star-filled"></i>
                      <i className="ti ti-star-filled"></i>
                      <span className="text-white">
                        {"("} 99% Positive Seller {")"}
                      </span>
                    </div>
                  </div>
                  <Link
                    className="btn btn-primary btn-sm mt-3"
                    href={`/vendor-shop/${vendor.vendor_id}`}
                  >
                    Go to store
                    <i className="ti ti-arrow-right ms-1"></i>
                  </Link>
                  {/* <!-- Vendor Profile--> */}
                  <div
                    className="vendor-profile shadow"
                    style={{
                      padding: 0,
                      overflow: 'hidden',
                      position: 'absolute'
                    }}
                  >
                    <img
                      src={vendor.avatar_url || "/assets/img/vendor/vendor-avatar.png"}
                      onError={(e) => {
                        e.currentTarget.src = "/assets/img/vendor/vendor-avatar.png";
                      }}
                      alt={vendor.vendor_name}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        maxWidth: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="container w-full items-center justify-align-center flex ">
              <div ref={loadMoreRef} style={{ height: "10px" }} />
              {VendorsQuery.isFetchingNextPage && (
                <div className="spinner-border " role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
    </>
  );
};

export default Vendors;
