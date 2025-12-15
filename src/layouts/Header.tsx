"use client";
import Offcanvas from "@/components/common/Offcanvas";
import UserAvatar from "@/components/ui/UserAvatar";
import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(!show);

  const { user } = useAuthStore();
  const { productsInCart } = useCartStore();

  useEffect(() => {
    console.log(user);
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
                <span>{Object.values(productsInCart).length}</span>
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
