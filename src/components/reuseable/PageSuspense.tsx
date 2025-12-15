import Image from "next/image";

export const PageSuspense = () => {
  return (
    <div className="d-flex w-100 vh-100 align-items-center justify-content-center p-4">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
        {/* <Image
          src="/logo/Logo-icon.webp"
          width={40}
          height={40}
          alt="xhero-logo"
          className="position-absolute top-50 start-50 translate-middle"
          style={{ zIndex: 10 }}
          priority
          unoptimized
        /> */}
      </div>
    </div>
  );
};
