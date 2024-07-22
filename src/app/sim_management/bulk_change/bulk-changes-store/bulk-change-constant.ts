export const BULK_CHANGE_TEXT = {
  ADD_INPUT_TYPE: "Add {0}",
  SIMLIST: "simList",
  SIMINFOLIST: "simInfoList",
  ADD_MORE: "Add more",
  BULK_ITEMS: "Bulk {0}s",
  ADD: "Add",
  CLOSE: "Close",
  BULK_SIM_DESCRIPTION: "Enter one sim per line, such as the following:",
  UNSUPPORTED_SERVICE_PROVIDER:
    "Current service provider is unsupported to process bulk change",
  ARCHIVE_WARNING:
    "Are you sure that the final bill has been sent for all of these devices? These devices will no longer be available in AMOP.",
  OVERRIDE_VALIDATION: "Override Validation and Archive Anyway?",
  UNSUPPORTED_ACTION_OR_SERVICE_PROVIDER:
    "Selected Action or Service Provider is unsupported!",
  BULK_CHANGE_CREATED_SUCCESSFULLY: "Bulk change created successfully!",
};

export const MIN_LENGTH = 8;
export const MAX_LENGTH = 22;

export const VALIDATION_MESSAGE = {
  FORMAT: "{0} is only contain numbers",
  EMPTY: "{0} cannot be empty",
  MIN_LENGTH: "{0} cannot be less than 8 digits",
  MAX_LENGTH: "{0} cannot be more than 22 digits",
  DUPLICATED: "{0} is duplicated",
  BULK_FORMAT: "Make sure the input is in the correct format.",
  LENGTH_RANGE: "{0} is only contain numbers and 8-22 digits",
  VALIDATION_ERROR: "An error occurred while validating bulk change data",
  INVALID_SERVICE_PROVIDER: "Invalid service provider",
  INVALID_SIMS: "Invalid sims",
  INVALID_ACTION: "Invalid action",
  VALID_SIMS: "Selected devices are valid and ready to be archived!",
};

export const INPUT_TYPE = {
  ICCID: "ICCID",
  SUBSCRIBER_NUMBER: "Subscriber Number",
  IMEI: "IMEI",
  MSISDN: "MSISDN",
};

export const BULK_CHANGE_SUMMARY_MESSAGE = {
  SUMMARY: "Bulk Change Summary",
  CONFIRMATION: "Confirmation",
  SIMS_TO_UPDATE: "SIMs to update",
  TOTAL_SIMS: "Total SIMs",
  SERVICE_PROVIDER: "Service Provider",
  SIM: "SIM {0}",
  SIM_STATUS: "SIM Status",
  ASSIGN_CUSTOMER: "Assign Customer",
  CUSTOMER: "Customer",
  CUSTOMER_NAME_TPL: "({0}) {1}",
  SERVICE_PRODUCT: "Service Product",
  PROVIDER: "Provider",
  SERVICE_TYPE: "Service Type",
  PACKAGE: "Package",
  PRODUCTS: "Products",
  DEVICE_STATUS: "Device Status",
  TARGET_STATUS: "Target Status",
  PRODUCT_NAME_RATE_TPL: "{0} - ${1}",
};
export const STATUS = {
  PROCESSED: "PROCESSED",
  ERROR: "ERROR",
};

export enum STATUS_TYPE {
  UPLOAD = "upload",
  SUCCESSFUL = "successful",
  ERRORS = "errors",
}

export const BULK_CHANGE_QUERY_KEY = {
  BULK_CHANGE_DATA: "bulk-change-data",
  BULK_CHANGE_HEADER_OPTIONS: "bulk-change-header-options",
};
