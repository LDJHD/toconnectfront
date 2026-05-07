"use client";

import { Fade } from "react-awesome-reveal";

const FadeComponent = ({ children, ...props }: any) => {
  return (
    <Fade triggerOnce duration={400} {...props}>
      {children}
    </Fade>
  );
};

export default FadeComponent;
