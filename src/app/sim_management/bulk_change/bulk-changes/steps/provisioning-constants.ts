import { StepProps } from "antd";
export const ADM_PROVISIONING_HIDE_COLUMNS = "adm-provisioning-hide-columns";
export const SEARCH_PLACEHOLDER_PROVISIONING =
  "ICCID, IMEI, MAC Address, Customer, Device Model, Carrier, Group, License, Status, Created By";
export const PROVISION_DEVICE_BUTTON = "Provision Device";
export const ACTIVATE_ICCID_BUTTON = "Activate ICCID";
export const DATE_PICKER_FORMAT = "MMM DD YYYY";

export const PROVISIONING_URL = "/en/device-management/provisioning";

export const PROVISION_DEVICE_STEP: StepProps[] = [
  {
    title: "Add Device",
    status: "process",
  },
  {
    title: "Choose Manufacturer",
    status: undefined,
  },
  {
    title: "Provision Device",
    status: undefined,
  },
  {
    title: "Assign Customer",
    status: undefined,
  },
  {
    title: "Add Customer Rate Plan/Pool",
    status: undefined,
  },
  {
    title: "Summary",
    status: undefined,
  },
];

export const PROVISION_DEVICE_VALIDATE_STEP_KEY: string[] = [
  "AddDevice",
  "ChooseManufacturer",
  "ProvisionDevice",
  "AssignCustomer",
  "AddCustomerRatePlanRatePool",
];

export const PROVISION_MULTI_DEVICES_VALIDATE_STEP_KEY: string[] = [
  "ProvisionDevice",
  "AssignCustomer",
  "AddCustomerRatePlanRatePool",
];

export const PROVISION_MULTIPLE_DEVICE_STEP: StepProps[] = [
  {
    title: "Provision Device",
    status: "process",
  },
  {
    title: "Assign Customer",
    status: undefined,
  },
  {
    title: "Add Customer Rate Plan/Pool",
    status: undefined,
  },
  {
    title: "Summary",
    status: undefined,
  },
];

export const CheckValidSelectedDeviceResult = {
  VALID: "valid",
  INVALID_MANUFACTURER: "manufacturer",
  INVALID_PROVIDER: "provider",
  PROVISIONED: "provisioned",
};

export const REGEX_NUMBER_ONLY = /^[0-9]+$/;
export const REGEX_MAC_ADDRESS = /^[A-Fa-f0-9]+$/;
export const REGEX_FLOAT_ONLY = /^\d+(?:\.\d+)?$/;
export const RATE_REPLACE_FORMAT_REGEX = /\B(?=(\d{3})+(?!\d))/g;
export const RATE_REPLACE_PARSER_REGEX = /(,*)/g;

export const PROVISION_DATE_FORMAT = "YYYY-MM-DD";

export const PROVISION_QUERY_STALE_TIME = 1000 * 60 * 5;
export const PROVISION_QUERY_RETRY = 1;

export const IMEI_MIN_LENGTH = 15;
export const IMEI_MAX_LENGTH = 17;
export const IMEI_VALIDATION_MESSAGE = {
  FORMAT: "IMEI is only contain numbers",
  EMPTY: "IMEI cannot be empty",
  MIN_LENGTH: "IMEI cannot be less than 15 digits",
  MAX_LENGTH: "IMEI cannot be more than 17 digits",
  DUPLICATED: "IMEI is duplicated",
};
export const ICCID_MIN_LENGTH = 18;
export const ICCID_MAX_LENGTH = 22;
export const ICCID_VALIDATION_MESSAGE = {
  FORMAT: "ICCID is only contain numbers",
  EMPTY: "ICCID cannot be empty",
  MIN_LENGTH: "ICCID cannot be less than 18 digits",
  MAX_LENGTH: "ICCID cannot be more than 22 digits",
  DUPLICATED: "ICCID is duplicated",
};
export const MAC_ADDRESS_LENGTH = 12;
export const MAC_ADDRESS_VALIDATION_MESSAGE = {
  FORMAT: "MAC Address is only contains [a-f, A-F, 0-9]",
  EMPTY: "MAC Address cannot be empty",
  LENGTH: "MAC Address is contains 12 characters",
  DUPLICATED: "MAC Address is duplicated",
};

export const BULK_VALIDATE_MESSAGE = {
  FORMAT: "Make sure the input is in the correct format.",
  IMEI: "IMEI is only contains numbers and 15 - 17 digits.",
  ICCID: "ICCID is only contain numbers and 18 - 22 digits.",
  MAC_ADDRESS:
    "MAC Address is only contains [a-f, A-F, 0-9] and 12 characters.",
};

export const MANUFACTURERS_SUPPORTED = ["bec"];
export const DEFAULT_MANUFACTURER = "bec";

export const DEFAULT_DEVICE_ALERT_OVERRIDE_OPTIONS = [
  "Downtime Alert",
  "Downtime Threshold",
  "Bandwidth Data Usage",
  "Device in Failover",
  "Device Reboot",
];

export const PROVISION_TEXT = {
  CHOOSE_MANUFACTURER_TEXT: "Choose manufacturer to continue:",
  BACK: "Back",
  BACK_TO_PROVISION_STEPS: "Back to provision steps",
  BACK_TO_ACTIVATION_STEPS: "Back to activation steps",
  CONTINUE: "Continue",
  LABEL: "label",
  PROVISION_DEVICE: "Provision Device",
  DEVICE_MODEL_REQUIRED: "Device Model must be selected",
  DEVICE_MODEL_NAME: "deviceModel",
  DEVICE_MODEL_LABEL: "Device Model",
  DEVICE_MODEL_PLACEHOLDER: "Select Device Model",
  GROUP_REQUIRED: "Group must be selected",
  GROUP_NAME: "group",
  GROUP_LABEL: "Group",
  GROUP_PLACEHOLDER: "Select Group",
  LICENSE_REQUIRED: "License Type must be selected",
  LICENSE_NAME: "licenseType",
  LICENSE_LABEL: "License Type",
  LICENSE_PLACEHOLDER: "Select License Type",
  DEVICE_ALERT_OVERRIDE: "Device Alert Override?",
  DEVICE_ALERT_OVERRIDE_LIST: "Device Alert Override list",
  EMAIL_REQUIRED: "Email Address cannot be empty",
  EMAIL_NAME: "emailAddress",
  EMAIL_LABEL: "Email Address:",
  EMAIL_PLACEHOLDER:
    "Enter alert recipient email address. If there are multiple recipients, separate email addresses by comma.",
  USE_EXISTING_CUSTOMER: "Use Existing Customer?",
  CUSTOMER_ALERT_MESSAGE: "Select Customer to create Service/Product",
  CUSTOMER_REQUIRED: "Customer must be selected",
  CUSTOMER_NAME: "customer",
  CUSTOMER_LABEL: "Customer Name",
  CUSTOMER_PLACEHOLDER: "Select Customer",
  CREATE_SERVICE_PRODUCT: "Create Service/Product?",
  PROVIDER_REQUIRED: "Provider must be selected",
  PROVIDER_NAME: "provider",
  PROVIDER_LABEL: "Provider",
  PROVIDER_PLACEHOLDER: "Select a Provider",
  SERVICE_REQUIRED: "Service Type must be selected",
  SERVICE_NAME: "serviceType",
  SERVICE_LABEL: "Service Type",
  SERVICE_PLACEHOLDER: "Select a Service Type",
  PRODUCT_REQUIRED: "Product must be selected",
  PRODUCT_NAME: "product",
  PRODUCT_LABEL: "Product",
  PRODUCT_PLACEHOLDER: "Select Some Options",
  PRODUCT_NOT_FOUND: "No Product found with Provider: ",
  PACKAGE_REQUIRED: "Package must be selected",
  PACKAGE_NAME: "package",
  PACKAGE_LABEL: "Package",
  PACKAGE_PLACEHOLDER: "Select a Package",
  PACKAGE_NOT_FOUND: "No Package found with Provider: ",
  RATES: "Rates",
  RATE: "Rate",
  PLEASE_SELECT_PRODUCT_OR_PACKAGE: "Please select Product or Package",
  PRORATE: "Prorate?",
  PRORATE_DATE_REQUIRED: "Effective Date must be selected",
  PRORATE_DATE_NAME: "prorateEffectiveDate",
  EFFECTIVE_DATE: "Effective Date",
  PRORATE_DATE_PLACEHOLDER: "MM/DD/YYYY",
  PRORATE_DATE_FORMAT: "MM/DD/YYYY",
  USE_CARRIER_ACTIVATION: "Use Carrier Activation",
  CUSTOMER_RATE_PLAN_REQUIRED: "Customer Rate Plan must be selected",
  CUSTOMER_RATE_PLAN_NAME: "customerRatePlan",
  CUSTOMER_RATE_PLAN_LABEL: "Customer Rate Plan",
  CUSTOMER_RATE_PLAN_PLACEHOLDER: "Select Customer Rate Plan",
  RATE_DATE_REQUIRED: "Effective Date must be selected",
  RATE_DATE_NAME: "rateEffectiveDate",
  RATE_DATE_PLACEHOLDER: "MM/DD/YYYY",
  RATE_DATE_FORMAT: "MM/DD/YYYY",
  CUSTOMER_POOL_NAME: "customerPool",
  CUSTOMER_POOL_LABEL: "Customer Pool",
  CUSTOMER_POOL_PLACEHOLDER: "Select Customer Pool",
  SUCCESSFULLY_PROVISIONED: "Successfully Provisioned",
  SUCCESSFULLY_ACTIVATED_AND_PROVISIONED:
    "Successfully Activated & Provisioned",
  DEVICE: "Device",
  PROVISION_SUCCESS_SUB_TITLE1: "Provision log ID: ",
  PROVISION_SUCCESS_SUB_TITLE2:
    "Server takes 1-5 minutes to process, please wait.",
  PROVISION_NEW_DEVICE: "Provision New Device",
  ACTIVATE_AND_PROVISION_NEW_DEVICE: "Activate & Provision New Device",
  FINISH_AND_CLOSE: "Finish & Close",
  DEVICELIST: "deviceList",
  imei: "imei",
  IMEI: "IMEI",
  iccid: "iccid",
  ICCID: "ICCID",
  macAddess: "macAddress",
  MACADDRESS: "MAC Address",
  mac: "mac",
  or: "or",
  BULK_DEVICE_DESCRIPTION:
    "Enter one device per line with IMEI followed by ICCID, MAC Address, such as the following:",
  BULK_ICCID_DESCRIPTION:
    "Enter one device per line with ICCID followed by IMEI, such as the following:",
  BULK_ICCID_DESCRIPTION_2_1: "would be optional for Active Status so if",
  BULK_ICCID_DESCRIPTION_2_2:
    "was already added to AMOP during Pending activation,",
  BULK_ICCID_DESCRIPTION_2_3: "would be used.",
  BULK_DEVICE_SEPARATED: "(can also be separated by tab or space)",
  BULK_DEVICES: "Bulk devices",
  BULK_ICCIDS: "Bulk ICCIDs",
  BULKDEVICES: "Bulk Devices",
  ADD_MORE: "Add more",
  ADD_DEVICE: "add-device",
  ADD: "Add",
  CLOSE: "Close",
  DEVICE_LIST: "Device list",
  MANUFACTURER: "Manufacturer",
  ADD_CUSTOMER_RATE_PLAN_POOL: "Add Customer Rate Plan/Pool",
  ADD_CUSTOMER_RATE_PLAN: "Add Customer Rate Plan?",
  CUSTOMER_RATE_PLAN_EFFECTIVE_DATE: "Customer Rate Plan Effective Date",
  OR: "OR",
  ASSIGN_CUSTOMER: "Assign Customer",
  VIEW_LOG_DETAILS: "View Log Details",
  CANCEL: "Cancel",
  SUBMIT: "Submit",
  SUBMIT_ACTIVATION_AND_PROVISION: "Submit Activation & Provision",
  CONTINUE_TO_PROVISION: "Continue to Provision",
  NUMBER_OF_SELECTED_DEVICE: "Number of selected device",
  SUBMITTING_THE_PROVISION: "Submitting the provision. Please wait ...",
  SUBMITTING_THE_ACTIVATION_ICCID_AND_PROVISION:
    "Submitting the activation ICCID and provision. Please wait ...",
  PROVISION_FAILED_RESULT_TITLE:
    "There are some problems with your provisioning operation.",
  ACTIVATION_OR_PROVISION_FAILED_RESULT_TITLE:
    "There are some problems with your activation or provisioning operation.",
  PROVISION_FAILED_RESULT_SUB_TITLE:
    "You can go back to the provision steps or cancel this provision.",
  ACTIVATION_OR_PROVISION_FAILED_RESULT_SUB_TITLE:
    "You can go back to the activation steps or cancel this activation or provision.",
  SELECTED_DEVICES: "Selected devices",
  SELECTED_DEVICES_PROVISIONED_ERROR:
    "The selected devices includes a provisioned device. Please remove the device to continue.",
  SELECTED_DEVICES_PROVIDER_ERROR:
    "The selected devices must be the same provider. Please remove the device to continue.",
  SELECTED_DEVICES_MANUFACTURER_ERROR:
    "The selected devices must be the same manufacturer and only BEC Manufacturer is supported. Please remove the device to continue.",
  PROVISION_DEVICES: "Provision Devices",
  ACTIVATE_ICCID_AND_PROVISION_DEVICES: "Activate ICCID and Provision Devices",
  process: "process",
  error: "error",
  CHOOSE_MANUFACTURER: "Choose Manufacturer",
  GO_TO_PROVISIONING_LOGS: "Go to Provisioning Logs",
  PROVIDER: "Provider",
  STATUS: "Status",
  PENDING: "Pending",
  RESET_AND_CLOSE: "Reset & Close",
  RETAIN_AND_CLOSE: "Retain & Close",
  CANCEL_CONFIRMATION_TITLE: "Unfinished Provision Steps",
  CANCEL_CONFIRMATION_DESCRIPTION:
    "You have unfinished provision steps. Would you like to retain the data or reset it?",
  REQUIRED_TARGET_STATUS: "Target status is required for activating ICCID",
};

export const PROVISION_FIELD = {
  CUSTOMER: "customer",
  PROVIDER: "provider.id",
  SERVICE_TYPE: "serviceType",
  PRODUCT: "product",
  PACKAGE: "package",
  PRORATE_EFFECTIVE_DATE: "prorateEffectiveDate",
};

export const PROVISION_QUERY_KEY = {
  MODEL: "provision-model-options",
  GROUP: "provision-group-options",
  LICENSE: "provision-license-options",
  CUSTOMER: "provision-customer-options",
  PROVIDER: "provision-provider-options",
  SERVICE: "provision-service-options",
  PRODUCT: "provision-product-options",
  PACKAGE: "provision-package-options",
  CUSTOMER_RATE_PLAN: "provision-customer-rate-plan-options",
  CUSTOMER_POOL: "provision-customer-pool-options",
  GET_PROVISION: "get-provision",
};

export const NONE_SELECT_OPTION = { value: "", label: "None" };

export const PROVISIONING_ACTION_TYPE = {
  PROVISION: "Provision",
  ACTIVATE_ICCID: "Activate ICCID",
};
