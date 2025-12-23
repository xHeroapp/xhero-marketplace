"use client";
import Link from "next/link";
import React from "react";

const RewardSuccess = () => {
  return (
    <>
      <div className="order-success-wrapper">
        <div className="content">
          <div className="display-1 text-white mb-2">
            <i className="ti ti-circle-check"></i>
          </div>
          <h5 className="text-white">Reward Redeemed Successfully</h5>
          <p className="text-white opacity-75">
            We will notify you of all the details via email. Thank you!
          </p>
          <Link className="btn btn-primary mt-3" href="/home">
            <i className="ti ti-arrow-left pe-2"></i>Shopping Again
          </Link>
        </div>
      </div>
    </>
  );
};

export default RewardSuccess;
