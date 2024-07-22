import { useArchivalConfirmationStore } from "../../bulk-changes-store/archival-confirmation.store";
import { useArchivalValidation } from "../bulk-change.hooks";
import { Alert, Checkbox } from "antd";
import { BULK_CHANGE_TEXT } from "../../bulk-changes-store/bulk-change-constant";
import LoadingPannelWrapper from "./loading-panel-wrapper";

export const ArchivalConfirmation: React.FC = () => {
  const { overrideValidation, setOverrideValidation } =
    useArchivalConfirmationStore();

  const { validationMessage, showOverrideValidation, errorSims } =
    useArchivalValidation();

  const handleChangeOverrideValidation = () => {
    setOverrideValidation(!overrideValidation);
  };

  return (
    <>
      <LoadingPannelWrapper
        loadingText=""
        isLoading={validationMessage.length === 0}
      >
        <Alert
          message="Warning"
          description={BULK_CHANGE_TEXT.ARCHIVE_WARNING}
          type="warning"
          showIcon
        />
        <div className="archive-bulk-change-confirmation-row">
          <div className="field-label">
            {validationMessage}
            {errorSims.length > 0 && <span>:</span>}
          </div>
          {errorSims.length > 0 && <div>{errorSims.join(", ")}</div>}
        </div>
        {showOverrideValidation && (
          <div className="archive-bulk-change-confirmation-row">
            <Checkbox
              onChange={handleChangeOverrideValidation}
              className="field-label"
              checked={overrideValidation}
            >
              {BULK_CHANGE_TEXT.OVERRIDE_VALIDATION}
            </Checkbox>
          </div>
        )}
      </LoadingPannelWrapper>
    </>
  );
};
