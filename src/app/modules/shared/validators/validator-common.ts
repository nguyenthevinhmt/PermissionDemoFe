import { AbstractControl, ValidatorFn } from '@angular/forms';
import { EErrorCode } from '../consts/errorCode.const';
import { BaseConsts } from '../consts/base.const';

// Validator cho chuỗi
export function required(
  isRequired: boolean = true,
  maxLength?: number
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (isRequired) {
      if (
        (['number', 'string'].includes(typeof control?.value) &&
          !control.value.toString().trim()) ||
        (!control?.value && control?.value !== 0)
      ) {
        return { errorMessage: BaseConsts.requiredError };
      }
    }
    if (
      maxLength &&
      control.value &&
      control.value.toString().length > maxLength
    ) {
      return { errorMessage: `Độ dài tối đa là ${maxLength}` };
    }
    return null;
  };
}

export function requiredArray(messageError?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: string } | null => {
    if (Array.isArray(control?.value) && control?.value?.length === 0) {
      return {
        errorMessage: messageError || 'Vui lòng chọn ít nhất 1 phần tử!',
      };
    }
    return null;
  };
}
