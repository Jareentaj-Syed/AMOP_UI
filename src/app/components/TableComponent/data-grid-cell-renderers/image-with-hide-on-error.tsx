import React, { FC, useState } from "react";
import { Popover } from "antd";
import Image from "next/image"; // Replace with actual image component library

interface ImageWithHideOnErrorProps {
  src: string;
  alt: string;
  style: React.CSSProperties;
  onError: () => void;
}

const ImageWithHideOnError: FC<ImageWithHideOnErrorProps> = ({
  src,
  alt,
  style,
  onError,
}) => {
  const [hideImage, setHideImage] = useState(false);

  return (
    <>
      {!hideImage ? (
        <Popover content={alt.toUpperCase()} trigger="hover">
          <Image
            src={src}
            alt={alt}
            width={100}
            height={100}
            loading="eager"
            onError={() => {
              setHideImage(true);
              onError(); // Call parent component's error handling
            }}
            style={style}
          />
        </Popover>
      ) : (
        <>{alt}</>
      )}
    </>
  );
};

export default ImageWithHideOnError;
