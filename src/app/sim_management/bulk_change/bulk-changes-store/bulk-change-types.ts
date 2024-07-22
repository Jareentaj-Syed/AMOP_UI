export type DeviceChangeRequestType = {
  id: number;
  Code: string;
  DisplayName: string;
};

export type DeviceChangeRequestTypeIntegration = {
  id: number;
  ChangeRequestTypeId: number;
  IntegrationId: number;
};

export type ICCIDIMEI = {
  ICCID: string;
  IMEI: string;
};

export type SearchSimResponse = {
  ICCID: string;
  IMEI: string;
  MSISDN: string;
};

// TODO: Update when implement new bulk change type
export type BulkChangeCreateRequest = {
  serviceProviderId: number;
  changeType: string;
  processChanges: boolean;
  overrideValidation?: boolean;
  devices: string[];
};

export type BulkChangeValidation = {
  isValid: boolean;
  validationMessage: string;
  errorSims: string[];
};

export type BulkChangeDataType = {
  id: number;
  serviceProvider: string;
  changeType: string;
  status: string;
  uploaded: number;
  successful: number;
  errors: number;
  createdBy: string;
  createdDate: string;
};

export type BulkChangeCreateResponse = {
  bulkChangeId?: number;
  errorMessage?: string;
};


export enum BulkChangeTypeEnum {
  STATUS_UPDATE = "StatusUpdate",
  CARRIER_RATE_PLAN_CHANGE = "CarrierRatePlanChange",
  CUSTOMER_RATE_PLAN_CHANGE = "CustomerRatePlanChange",
  CUSTOMER_ASSIGNMENT = "CustomerAssignment",
  ARCHIVAL = "Archival",
  ACTIVATE_NEW_SERVICE = "ActivateNewService",
  CREATE_REV_SERVICE = "CreateRevService",
  CHANGE_ICCID_IMEI = "ChangeICCID/IMEI",
  EDIT_USERNAME = "EditUsername",
}
