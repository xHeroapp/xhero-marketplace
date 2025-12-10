
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <div className="footer-nav-area" id="footerNav">
        <div className="suha-footer-nav">
          <ul className="h-100 d-flex align-items-center justify-content-between ps-0 d-flex rtl-flex-d-row-r">
            <li><Link href="/home"><i className="ti ti-home"></i>Home</Link></li>
            <li><Link href="/message"><i className="ti ti-message"></i>Chat</Link></li>
            <li><Link href="/cart"><i className="ti ti-basket"></i>Cart</Link></li>
            <li><Link href="/settings"><i className="ti ti-settings"></i>Settings</Link></li>
            <li><Link href="/pages"><i className="ti ti-heart"></i>Pages</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Footer;