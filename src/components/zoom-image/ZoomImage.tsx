"use client";

const ZoomImage = ({ src, alt, className = "" }: any) => {
  return (
    <img
      src={src}
      alt={alt || ""}
      className={className}
      style={{ width: "100%", cursor: "zoom-in" }}
    />
  );
};

export default ZoomImage;
