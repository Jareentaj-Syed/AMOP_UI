import { useMemo } from "react";
import { IntegrationEnum } from "./integration-enum";
import { INPUT_TYPE } from "../../bulk-changes-store/bulk-change-constant";

export function useSimLabel(integrationId: number) {
  return useMemo(() => {
    switch (integrationId) {
      case IntegrationEnum.ATT_TELEGENCE:
      case IntegrationEnum.ATT_PARTNER_EXCHANGE:
      case IntegrationEnum.ATT_EBONDING:
        return INPUT_TYPE.SUBSCRIBER_NUMBER;
      case IntegrationEnum.ATT_CISCO_JASPER:
      case IntegrationEnum.VERIZON_THINGSPACE:
      case IntegrationEnum.ATT_POD19:
      case IntegrationEnum.T_MOBILE_JASPER:
      case IntegrationEnum.TEAL:
      case IntegrationEnum.POND_MOBILE:
        return INPUT_TYPE.ICCID;
      default:
        return "";
    }
  }, [integrationId]);
}
