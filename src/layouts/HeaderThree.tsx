"use client";
import OffcanvasTwo from "@/components/common/OffcanvasTwo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const HeaderThree = ({ links, title }: any) => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(!show);
  const pathname = usePathname();

  useEffect(() => {
    // Close offcanvas on route change
    setShow(false);

    // Force close using Bootstrap's API if available
    const offcanvasElement = document.getElementById("suhaOffcanvas");
    if (offcanvasElement && typeof window !== "undefined") {
      // @ts-ignore
      const bsOffcanvas =
        window.bootstrap?.Offcanvas?.getInstance(offcanvasElement);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }

    // Aggressive backdrop removal
    setTimeout(() => {
      const backdrops = document.querySelectorAll(
        ".offcanvas-backdrop, .modal-backdrop"
      );
      backdrops.forEach((backdrop) => backdrop.remove());

      document.body.classList.remove("offcanvas-open", "modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }, 150);
  }, [pathname]);

  return (
    <>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
          <div className="back-button me-2">
            <Link href={`/${links}`}>
              <i className="ti ti-arrow-left"></i>
            </Link>
          </div>

          <div className="page-heading">
            <h6 className="mb-0">{title}</h6>
          </div>

          <div
            className="filter-option ms-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#suhaFilterOffcanvas"
            aria-controls="suhaFilterOffcanvas"
          >
            {/* <i
              onClick={() => handleShow()}
              className="ti ti-adjustments-horizontal"
            ></i> */}
          </div>
        </div>
      </div>

      <OffcanvasTwo handleShow={handleShow} show={show} />
    </>
  );
};

export default HeaderThree;
