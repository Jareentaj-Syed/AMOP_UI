import { Spin } from "antd";

export default function LoadingPannelWrapper({
  isLoading,
  loadingText = "Loading...",
  children,
}: {
  isLoading: Boolean;
  loadingText: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {isLoading && <Spin tip={loadingText}>{children}</Spin>}
      {!isLoading && <>{children}</>}
    </>
  );
}
