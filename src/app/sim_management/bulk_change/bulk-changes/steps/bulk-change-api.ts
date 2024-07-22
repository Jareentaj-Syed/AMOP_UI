
export const BULK_CHANGE_ERROR = {
  SEARCH: "Search sim error",
  SEARCH_ICCID: "Search ICCID error",
  SEARCH_IMEI: "Search IMEI error",
  SEARCH_SUBSCRIBER_NUMBER: "Search Subscriber Number error",
  VALIDATE_BULK_CHANGE: "Validate bulk change error",
  SUBMIT_BULK_CHANGE: "Submit bulk change error",
};
import { BulkChangeCreateRequest, BulkChangeCreateResponse, BulkChangeValidation, SearchSimResponse } from "../../bulk-changes-store/bulk-change-types";
export const searchSimInfo = async (query: string) => {
  try {
    //
    // TODO: Call API here
    //
    // Return dummy data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const dummyData: SearchSimResponse[] = [
      {
        ICCID: "12345678",
        IMEI: "12345678",
        MSISDN: "12345678",
      },
      {
        ICCID: "987654321",
        IMEI: "987654321",
        MSISDN: "987654321",
      },
      {
        ICCID: "147258369",
        IMEI: "147258369",
        MSISDN: "147258369",
      },
    ];
    return (
      dummyData.filter(
        (sim) =>
          sim.ICCID.includes(query) ||
          sim.IMEI.includes(query) ||
          sim.MSISDN.includes(query),
      ) || []
    );
  } catch (error: any) {
    throw new Error(BULK_CHANGE_ERROR.SEARCH, {
      cause: {
        status: error?.response?.status,
        code: error?.code,
      },
    });
  }
};

export const validateBulkChange = async (request: BulkChangeCreateRequest) => {
  try {
    //
    // TODO: Call API here
    //
    // Return dummy data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const revActivatedDummyDevices = ["123456789", "234567891"];
    const invalidDevices = request.devices.filter((device) =>
      revActivatedDummyDevices.includes(device),
    );
    if (invalidDevices.length > 0) {
      return {
        isValid: false,
        validationMessage: "One or more devices have active Rev Services",
        errorSims: invalidDevices,
      } as BulkChangeValidation;
    }
    return {
      isValid: true,
      validationMessage: "",
      errorSims: [],
    } as BulkChangeValidation;
  } catch (error: any) {
    throw new Error(BULK_CHANGE_ERROR.VALIDATE_BULK_CHANGE, {
      cause: {
        status: error?.response?.status,
        code: error?.code,
      },
    });
  }
};

export const submitBulkChange = async (request: BulkChangeCreateRequest) => {
  try {
    //
    // TODO: Call API here
    //
    // Return dummy data
    console.log(request);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const revActivatedDummyDevices = ["123456789", "234567891"];
    const serviceProviderId = 1;
    const invalidDevices = request.devices.filter((device) =>
      revActivatedDummyDevices.includes(device),
    );
    if (
      invalidDevices.length === 0 &&
      request.serviceProviderId === serviceProviderId
    ) {
      return {
        bulkChangeId: 1,
      } as BulkChangeCreateResponse;
    }
    return {
      errorMessage: "Error while creating bulk change",
    } as BulkChangeCreateResponse;
  } catch (error: any) {
    throw new Error(BULK_CHANGE_ERROR.SUBMIT_BULK_CHANGE, {
      cause: {
        status: error?.response?.status,
        code: error?.code,
      },
    });
  }
};
