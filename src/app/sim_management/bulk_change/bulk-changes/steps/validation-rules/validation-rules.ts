import { Rule } from "antd/es/form";
import { REGEX_NUMBER_ONLY } from "../utils";
import { FormatString } from "../utils";
import { MAX_LENGTH, MIN_LENGTH, VALIDATION_MESSAGE } from "../../../bulk-changes-store/bulk-change-constant";

export const GetSimInfoValidationRules = (
  inputField: string,
  formName: string,
  isSingleField: boolean = true,
): Rule[] => {
  const validationRules: Rule[] = [
    {
      pattern: REGEX_NUMBER_ONLY,
      message: FormatString(VALIDATION_MESSAGE.FORMAT, inputField),
    },
    {
      required: true,
      message: FormatString(VALIDATION_MESSAGE.EMPTY, inputField),
    },
    {
      min: MIN_LENGTH,
      message: FormatString(VALIDATION_MESSAGE.MIN_LENGTH, inputField),
    },
    {
      max: MAX_LENGTH,
      message: FormatString(VALIDATION_MESSAGE.MAX_LENGTH, inputField),
    },
    ({ getFieldValue }) => {
      return {
        validator: (_, value) => {
          const filteredItems = getFieldValue(formName)?.filter((item: any) =>
            isSingleField ? item === value : item?.[inputField] === value,
          );

          if (!value || filteredItems?.length === 1) {
            return Promise.resolve();
          }

          return Promise.reject(
            new Error(FormatString(VALIDATION_MESSAGE.DUPLICATED, inputField)),
          );
        },
      };
    },
  ];
  return validationRules;
};
