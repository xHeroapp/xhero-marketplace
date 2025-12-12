import MainHome from "@/components/MainHome";
import Wrapper from "@/layouts/Wrapper";
import React from "react";
import Intro from "./intro/page";

export const metadata = {
  title: "Xhero - Market Place",
};

const index = () => {
  return (
    <Wrapper>
      <Intro />
    </Wrapper>
  );
};

export default index;
