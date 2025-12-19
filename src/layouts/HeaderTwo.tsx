"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import Offcanvas from "@/components/common/Offcanvas";
import { usePathname, useRouter } from "next/navigation";

const HeaderTwo = ({ links, title }: any) => {
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

  const router = useRouter();

  return (
    <>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
          <div className="back-button me-2">
            <div onClick={() => router.back()}>
              <i className="ti ti-arrow-left"></i>
            </div>
          </div>

          <div className="page-heading">
            <h6 className="mb-0">{title}</h6>
          </div>

          <div
            className="suha-navbar-toggler ms-2"
            data-bs-toggle="offcanvas"
            data-bs-target="#suhaOffcanvas"
            aria-controls="suhaOffcanvas"
          >
            <div onClick={() => handleShow()}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <Offcanvas handleShow={handleShow} show={show} />
    </>
  );
};

export default HeaderTwo;
