import React, { FC, useState } from "react";
import { Popover } from "antd";
import ImageWithHideOnError from "../image-with-hide-on-error";

interface ServiceProviderCellProps {
  value: string;
}

const ServiceProviderCellRenderer: FC<ServiceProviderCellProps> = ({
  value,
}) => {
  const [hideImage, setHideImage] = useState(false);

  const getNetworkCarrierLogoUrl = (networkCarrier: string) => {
    const formattedName = networkCarrier?.trim().replace(/\./g, "").toUpperCase();
    const basePublicAssetsUrl = ""; // Replace with your actual URL prefix for public assets

    switch (formattedName) {
      case "AT&T":
      case "AT&T MOBILITY":
      case "AT&T WIRELESS":
      case "CENTENNIAL PUERTO RIO LICENSE CORP":
        return `${basePublicAssetsUrl}/AT&T.png`;
      case "CENTENNIAL COMMUNICATIONS":
        return `${basePublicAssetsUrl}/centennial-comm.png`;
      case "VERIZON":
      case "VERIZON WIRELESS":
        return `${basePublicAssetsUrl}/Verizon.png`;
      default:
        return `${basePublicAssetsUrl}/${formattedName}.png`;
    }
  };

  const logoUrl = getNetworkCarrierLogoUrl(value);

  return (
    <Popover content={value.toUpperCase()} trigger="hover">
      <ImageWithHideOnError
        src={logoUrl}
        alt={value ?? ""}
        style={{
          margin: "0 auto",
          maxWidth: "4rem",
          textIndent: -100,
          visibility: value ? "visible" : "hidden",
          height: value ? "auto" : "2.5rem",
        }}
        onError={() => setHideImage(true)}
      />
    </Popover>
  );
};

export function renderServiceProviderCell(value: string) {
  return <ServiceProviderCellRenderer value={value} />;
}

export default ServiceProviderCellRenderer;
