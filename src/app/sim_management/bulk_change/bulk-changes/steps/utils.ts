import localforage from "localforage";
import { StateStorage } from "zustand/middleware";
import { BULK_CHANGE_ERROR, searchSimInfo, submitBulkChange } from "./bulk-change-api";
import { BulkChangeCreateRequest, BulkChangeCreateResponse, SearchSimResponse } from "../../bulk-changes-store/bulk-change-types";

export const localForageWrapper: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await localforage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

export function getUTCDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}

export function FormatString(str: string, ...val: any[]): string {
  if (typeof str === "undefined") {
    throw new Error("Source string must not be undefined");
  }

  for (let index = 0; index < val.length; index++) {
    const replacement = String(val[index]);
    str = str.replace(`{${index}}`, replacement);
  }

  return str;
}


export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: any[]) => {
    clearTimeout(timeout!);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const searchByInputField = async (
  query: string,
): Promise<SearchSimResponse[]> => {
  try {
    const result = await searchSimInfo(query);
    return result;
  } catch (error: any) {
    throw new Error(BULK_CHANGE_ERROR.SEARCH, {
      cause: {
        status: error?.response?.status,
        code: error?.code,
      },
    });
  }
};

export const splitBulkSimInput = (inputStr: string, separator = "\n") => {
  return inputStr?.trim()?.split(separator);
};
export const REGEX_NUMBER_ONLY = /^[0-9]+$/;
export const numberOnlyRegExp = new RegExp(REGEX_NUMBER_ONLY);
export const validateSim = (sim: string) => {
  return numberOnlyRegExp.test(sim) && sim?.length >= 8 && sim?.length <= 22;
};
export const validateSimList = (inputStr: string): string[] => {
  let simList: string[] = [];
  for (let simItem of splitBulkSimInput(inputStr)) {
    //Loop every separated sim
    simItem = simItem?.trim();
    if (simItem?.length === 0) continue; //Skip empty line
    if (!validateSim(simItem)) {
      return [];
    }
    simList.push(simItem);
  }
  return simList;
};

export const validateSimListWithDualInfo = <T extends Record<string, any>>(
  inputStr: string,
  firstInputField: string,
  lastInputField: string,
): T[] => {
  const separatorSymbol = [",", "\t", " "];
  let simInfoList: T[] = [];
  const splitBulkSimInput = (input: string): string[] => {
    return input.split(/\r?\n/);
  };

  for (let simItem of splitBulkSimInput(inputStr)) {
    simItem = simItem?.trim();
    if (simItem?.length === 0) continue;

    let separatorIndex = -1;
    let firstElement = "";
    let lastElement = "";

    for (const symbol of separatorSymbol) {
      separatorIndex = simItem.indexOf(symbol);
      if (separatorIndex !== -1) {
        firstElement = simItem.slice(0, separatorIndex)?.trim();
        lastElement = simItem.slice(separatorIndex + 1)?.trim();
        break;
      }
    }

    let newSimInfo: Partial<T> = {};
    if (separatorIndex === -1 && simItem.length) {
      if (validateSim(simItem)) {
        firstElement = simItem;
        newSimInfo[firstInputField as keyof T] = firstElement as any;
        simInfoList.push(newSimInfo as T);
        continue;
      }
      return [];
    }

    if (firstElement.length && validateSim(firstElement)) {
      newSimInfo[firstInputField as keyof T] = firstElement as any;
    } else if (firstElement.length) {
      return [];
    }

    if (lastElement.length && validateSim(lastElement)) {
      newSimInfo[lastInputField as keyof T] = lastElement as any;
    } else if (lastElement.length) {
      return [];
    }

    simInfoList.push(newSimInfo as T);
  }

  return simInfoList;
};

export const createBulkChange = async (
  request: BulkChangeCreateRequest,
): Promise<BulkChangeCreateResponse> => {
  try {
    const result = await submitBulkChange(request);
    return result;
  } catch (error: any) {
    throw new Error(BULK_CHANGE_ERROR.SUBMIT_BULK_CHANGE, {
      cause: {
        status: error?.response?.status,
        code: error?.code,
      },
    });
  }
};


export const MODAL_WIDTH = {
  SMALL: 300,
  MEDIUM: 500,
  LARGE: 1300,
};
