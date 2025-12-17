"use client";

import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import ImageWithFallback from "./reuseable/ImageWithFallback";
import { useClientReady } from "@/hooks/useClientReady";

const Profile = () => {
  const ready = useClientReady();
  const { user } = useAuthStore();

  // stop render until client hydration
  if (!ready) return null;

  //  enforce auth
  if (!user) {
    return <p className="text-center mt-5">Loading profile...</p>;
    // or redirect("/login")
  }

  return (
    <>
      <Header />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="profile-wrapper-area py-3">
            <div className="card user-info-card">
              <div className="card-body p-4 d-flex align-items-center">
                <div className="user-profile me-3">
                  <ImageWithFallback
                    src={
                      user.avatar_url ||
                      "/assets/img/core-img/user-profile-male.jpg"
                    }
                    alt={user.full_name}
                  />
                </div>
                <div className="user-info">
                  <h5 className="mb-0 text-white">{user.full_name}</h5>
                  <p className="mb-0 text-white">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="card user-data-card">
              <div className="card-body">
                <div className="single-profile-data d-flex align-items-center justify-content-between">
                  <span>Phone</span>
                  <span>{user.phone}</span>
                </div>

                <div className="single-profile-data d-flex align-items-center justify-content-between">
                  <span>Address</span>
                  <span>{user.location}</span>
                </div>

                <div className="single-profile-data d-flex align-items-center justify-content-between">
                  <span>My Orders</span>
                  <Link className="btn btn-primary btn-sm" href="/my-order">
                    View Status
                  </Link>
                </div>

                <div className="edit-profile-btn mt-3">
                  <Link
                    className="btn btn-primary btn-lg w-100"
                    href="/edit-profile"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
