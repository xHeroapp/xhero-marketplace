import Link from "next/link";
import React from "react";

const index = () => {
  return (
    <>
      <div className="intro-wrapper d-flex align-items-center justify-content-center text-center">
        <div className="container">
          <img
            className="big-logo"
            src="/assets/img/logo/Logo-full.webp"
            alt=""
          />
        </div>
      </div>
      <div className="get-started-btn">
        <Link className="btn btn-custom btn-lg w-100" href="/login">
          Get Started
        </Link>
      </div>
    </>
  );
};

export default index;
