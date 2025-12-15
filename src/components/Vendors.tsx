"use client";
import vendors_data from "@/data/vendors_data";
import { useFilters } from "@/hooks/useFilters";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useGetVendors } from "@/queries/vendors.queries";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import ImageWithFallback from "./reuseable/ImageWithFallback";

const Vendors = () => {
  const loadMoreRef = useRef(null);

  const Filters = useFilters();

  // data fetching
  const VendorsQuery = useGetVendors(Filters);

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
          <div className="row gy-3">
            {vendors.map((vendor, i) => (
              <div key={vendor.vendor_id} className="col-12">
                {/* <!-- Single Vendor --> */}
                <div
                  className="single-vendor-wrap bg-img p-4 bg-overlay"
                  style={{
                    backgroundImage: `url(${
                      vendor.vendor_banner_url
                        ? vendor.vendor_banner_url
                        : "/assets/img/vendor/vendor-banner.png"
                    })`,
                  }}
                >
                  <h6 className="vendor-title text-white">
                    {vendor.vendor_name}
                  </h6>
                  <div className="vendor-info">
                    <p className="mb-1 text-white">
                      <i className="ti ti-email me-1"></i>
                      {vendor.email}
                    </p>
                    <div className="ratings lh-1">
                      {/* removed rating for now */}
                      {/* <i className="ti ti-star-filled"></i>
                      <i className="ti ti-star-filled"></i>
                      <i className="ti ti-star-filled"></i>
                      <i className="ti ti-star-filled"></i>
                      <i className="ti ti-star-filled"></i> */}
                      <span className="text-white">
                        {"("} {vendor.category_name} {")"}
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
                  <div className="vendor-profile shadow">
                    <figure className="m-0">
                      <ImageWithFallback
                        src={vendor.profile_img}
                        fallback="/assets/img/vendor/vendor-avatar.png"
                        alt={vendor.vendor_name}
                      />
                      {/* <img src={vendor.profile_img} alt="" /> */}
                    </figure>
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
