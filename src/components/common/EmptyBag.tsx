import Link from "next/link";
import Image from "next/image"; 
import empty_bag from "../../../public/assets/img/empty-cart.webp";

const EmptyBag = () => {
  return (
    <>
      <div className="empty_bag text-center mt-5 pt-5">
        <Image src={empty_bag} alt="empty-bag" />
        <h5 className="py-3">Your Bag is Empty</h5>
        <Link href={"/shop-grid"}>
            <button className="btn btn-primary btn-sm">Go To Shop</button>
        </Link>
      </div>
    </>
  );
};

export default EmptyBag;
