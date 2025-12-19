"use client";
import Offcanvas from "@/components/common/Offcanvas";
import UserAvatar from "@/components/ui/UserAvatar";
import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Header = () => {
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

  useEffect(() => {
    if (show) {
      setShow(false); // Actually close the offcanvas
      // Remove backdrop
      const backdrop = document.querySelector(".offcanvas-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
      // Remove body classes
      document.body.classList.remove("offcanvas-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [pathname]);

  const { loadCart, cart } = useCartStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user?.id) {
      loadCart(user?.id);
    }
  }, [user]);

  return (
    <>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between d-flex rtl-flex-d-row-r">
          <div className="logo-wrapper">
            <Link href="/home">
              <img
                src="/assets/img/logo/Logo-icon.webp"
                alt=""
                width={50}
                height={50}
                // className="w-20 h-20"
              />
            </Link>
          </div>
          <div className="navbar-logo-container d-flex align-items-center">
            <div className="cart-icon-wrap">
              <Link href="/cart">
                <i className="ti ti-basket-bolt"></i>
                <span>{Object.values(cart).length}</span>
              </Link>
            </div>

            <UserAvatar
              src={user?.avatar_url}
              fallbackText={user?.full_name || user?.email || "User"}
            />

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
      </div>
      <Offcanvas handleShow={handleShow} show={show} />
    </>
  );
};

export default Header;
