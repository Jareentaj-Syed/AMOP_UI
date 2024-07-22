import { useCallback, useEffect, useState } from "react";
import { useBulkChangeChooseServiceProvider } from "../bulk-changes-store/choose-service-provider.store";
import { useIccidStepStore } from "../bulk-changes-store/iccid-step.store";
import { useArchivalConfirmationStore } from "../bulk-changes-store/archival-confirmation.store";
import { BulkChangeTypeEnum } from "../bulk-changes-store/bulk-change-types";
import { BulkChangeCreateRequest } from "../bulk-changes-store/bulk-change-types";
import { validateBulkChange } from "./steps/bulk-change-api";
import { VALIDATION_MESSAGE } from "../bulk-changes-store/bulk-change-constant";

// Custom hook to get bulk change data
export const useBulkChangeData = () => {
  const { selectedAction, selectedServiceProvider } =
    useBulkChangeChooseServiceProvider();
  const { simList } = useIccidStepStore();
  const { overrideValidation, processImmediately } =
    useArchivalConfirmationStore();

  const getBulkChangeData = useCallback((): BulkChangeCreateRequest | null => {
    if (selectedAction && selectedServiceProvider?.id) {
      switch (selectedAction) {
        case BulkChangeTypeEnum.ARCHIVAL:
          return {
            devices: simList,
            serviceProviderId: selectedServiceProvider.id,
            changeType: selectedAction,
            overrideValidation,
            processChanges: processImmediately,
          };
        // Add cases for other bulk change types if needed
        default:
          return null;
      }
    } else {
      return null;
    }
  }, [
    selectedAction,
    selectedServiceProvider,
    simList,
    overrideValidation,
    processImmediately,
  ]);

  return getBulkChangeData;
};

export const useArchivalValidation = () => {
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [showOverrideValidation, setShowOverrideValidation] =
    useState<boolean>(false);
  const [errorSims, setErrorSims] = useState<string[]>([]);
  const { selectedServiceProvider, selectedAction } =
    useBulkChangeChooseServiceProvider();
  const { simList } = useIccidStepStore();

  useEffect(() => {
    if (
      selectedServiceProvider?.id &&
      selectedServiceProvider?.id > 0 &&
      simList?.length > 0 &&
      selectedAction
    ) {
      const bulkChangeData: BulkChangeCreateRequest = {
        serviceProviderId: selectedServiceProvider.id,
        changeType: selectedAction,
        processChanges: false,
        overrideValidation: false,
        devices: simList,
      };

      validateBulkChange(bulkChangeData)
        .then((result) => {
          if (result.isValid) {
            setValidationMessage(VALIDATION_MESSAGE.VALID_SIMS);
          } else {
            setValidationMessage(result.validationMessage);
            setErrorSims(result.errorSims);
            setShowOverrideValidation(true);
          }
        })
        .catch(() => {
          setValidationMessage(VALIDATION_MESSAGE.VALIDATION_ERROR);
        });
    } else {
      // Set validation messages based on missing data
      setValidationMessage(
        !selectedServiceProvider?.id || !(selectedServiceProvider?.id > 0)
          ? VALIDATION_MESSAGE.INVALID_SERVICE_PROVIDER
          : !(simList?.length > 0)
            ? VALIDATION_MESSAGE.INVALID_SIMS
            : !selectedAction
              ? VALIDATION_MESSAGE.INVALID_ACTION
              : VALIDATION_MESSAGE.VALIDATION_ERROR,
      );
    }
  }, [selectedServiceProvider?.id, simList, selectedAction]);

  return {
    validationMessage,
    showOverrideValidation,
    errorSims,
    setValidationMessage,
    setShowOverrideValidation,
    setErrorSims,
  };
};
