"use client";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import React from "react";
import UserAvatar from "../ui/UserAvatar";

const Offcanvas = ({ handleShow, show }: any) => {
  const { user } = useAuthStore();

  return (
    <>
      <div
        className={`offcanvas offcanvas-start suha-offcanvas-wrap ${
          show ? "show" : ""
        }`}
        tabIndex={-1}
        id="suhaOffcanvas"
        aria-labelledby="suhaOffcanvasLabel"
      >
        <button
          onClick={handleShow}
          className="btn-close btn-close-white"
          type="button"
        ></button>

        <div className="offcanvas-body">
          <div className="sidenav-profile">
            <div className="user-profile">
              <img src="/assets/img/bg-img/9.jpg" alt="" />
            </div>
            <div className="user-info">
              <h5 className="user-name mb-1 text-white">
                {user ? user.full_name : "User"}
              </h5>
              <p className="available-balance text-white">
                Current Balance $<span className="counter">99</span>
              </p>
            </div>
          </div>

          <ul className="sidenav-nav ps-0">
            <li>
              <Link href="/profile">
                <i className="ti ti-user"></i>My Profile
              </Link>
            </li>
            <li>
              <Link href="/notifications">
                <i className="ti ti-bell-ringing lni-tada-effect"></i>
                Notifications<span className="ms-1 badge badge-warning">3</span>
              </Link>
            </li>
            <li className="suha-dropdown-menu">
              <a href="#">
                <i className="ti ti-building-store"></i>Shop Pages
              </a>
              <ul>
                <li>
                  <Link href="/shop-grid">Shop Grid</Link>
                </li>
                <li>
                  <Link href="/shop-list">Shop List</Link>
                </li>
                <li>
                  <Link href="/single-product">Product Details</Link>
                </li>
                <li>
                  <Link href="/featured-products">Featured Products</Link>
                </li>
                <li>
                  <Link href="/flash-sale">Flash Sale</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/pages">
                <i className="ti ti-notebook"></i>All Pages
              </Link>
            </li>
            <li className="suha-dropdown-menu">
              <Link href="/wishlist-grid">
                <i className="ti ti-heart"></i>My Wishlist
              </Link>
              <ul>
                <li>
                  <Link href="/wishlist-grid">Wishlist Grid</Link>
                </li>
                <li>
                  <Link href="/wishlist-list">Wishlist List</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/settings">
                <i className="ti ti-adjustments-horizontal"></i>Settings
              </Link>
            </li>
            <li>
              <Link href="/intro">
                <i className="ti ti-logout"></i>Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Offcanvas;
