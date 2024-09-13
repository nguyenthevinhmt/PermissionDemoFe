import { PermissionConst } from './../../modules/shared/consts/permission.const';
import { Injector } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { StatusResponseConst } from 'src/app/modules/shared/consts/base.const';
import { LibHelperService } from 'src/app/modules/shared/services/lib-helper.service';
import { ToastService } from './toast/toast.service';
import { TokenService } from 'src/app/modules/shared/services/auth/token.service';
import { PermissionService } from 'src/app/modules/shared/services/auth/permission.service';

export abstract class ComponentBase {
  _libHelperService: LibHelperService;
  _toastService: ToastService;
  _permissionService: PermissionService;
  _tokenService: TokenService;

  PermissionConst = PermissionConst;

  constructor(injector: Injector) {
    this._libHelperService = injector.get(LibHelperService);
    this._toastService = injector.get(ToastService);
    this._permissionService = injector.get(PermissionService);
    this._tokenService = injector.get(TokenService);
    if (this._tokenService.getToken()) {
      this._permissionService.getCurrentPermission();
    }
  }

  markControls(formGroup: FormGroup, skipValidationForFields: string[] = []) {
    for (const i in formGroup.controls) {
      if (!skipValidationForFields.includes(i)) {
        formGroup.controls[i].markAsDirty();
      } else {
        formGroup.controls[i].clearValidators();
      }
      formGroup.controls[i].updateValueAndValidity({ emitEvent: false });
    }
  }
  public checkInValidForm(
    formGroup: FormGroup,
    skipValidationForFields: string[] = []
  ): boolean {
    // Duyệt qua tất cả các controls trong formGroup
    this.markControls(formGroup, skipValidationForFields);

    // Duyệt qua các controls trong FormArray
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];
      if (control instanceof FormArray) {
        control.controls.forEach((controlItem: FormGroup | AbstractControl) => {
          // Gọi hàm markControls cho mỗi control trong FormArray
          if (controlItem instanceof FormGroup) {
            this.markControls(controlItem, skipValidationForFields);
          }
        });
      }
    });

    // Kiểm tra xem có bất kỳ control nào INVALID không
    let isInvalid = false;
    Object.keys(formGroup.controls).forEach((key) => {
      if (formGroup.controls[key].status === 'INVALID') {
        // Utils.log(`invalid`, {
        //   controlName: key,
        //   controls: formGroup.controls[key],
        // });
        isInvalid = true;
      }
    });

    return isInvalid;
  }

  isInvalidMessage(form: FormGroup, controlName: string): boolean {
    return !!(
      form?.get(controlName)?.hasError('errorMessage') &&
      form?.get(controlName)?.invalid &&
      form?.get(controlName)?.touched
    );
  }

  checkValidForm(isValid: boolean) {
    if (!isValid) this.messageError('Vui lòng nhập đủ thông tin!');
    return isValid;
  }

  isInvalidMessageInArray(
    formArray: FormArray,
    index: number,
    controlName: string
  ): boolean {
    const control = formArray.at(index).get(controlName);
    return !!(
      control?.hasError('errorMessage') &&
      control?.invalid &&
      control?.touched
    );
  }

  isInvalid(
    form: FormGroup,
    controlName: string,
    onClickSubmit?: boolean
  ): boolean {
    if (onClickSubmit) {
      return onClickSubmit && form?.get(controlName)?.invalid;
    }
    return !!(
      form?.get(controlName)?.invalid && form?.get(controlName)?.touched
    );
  }

  messageError(msg = '', summary = '', life = 3000) {
    return this._libHelperService.messageError(msg, summary, life);
  }

  messageSuccess(msg = '', summary = '', life = 1000) {
    return this._libHelperService.messageSuccess(msg, summary, life);
  }

  messageWarn(msg = '', life = 3000) {
    return this._libHelperService.messageWarn(msg, life);
  }

  checkStatusResponse(response, message?: string) {
    if (response?.status === StatusResponseConst.RESPONSE_TRUE) {
      if (message) {
        this.messageSuccess(message, null, 1000);
      } else if (message === undefined) {
        //response?.successFE &&
        // MESSAGE CHUNG CHO CREATE | UPDATE | DELETE KHI KHÔNG TRUYỀN VÀO PARAM MESSAGE
        // this.messageSuccess(message, null, 1000);
      }
      return true;
    }
    if (response?.message) {
      this.messageError(response?.message, null, 2500);
    } else {
      this.messageError('Có lỗi xảy ra, vui lòng thử lại sau!');
    }
    return false;
  }

  isGranted(permissionNames: string | string[]) {
    permissionNames =
      typeof permissionNames === 'string' ? [permissionNames] : permissionNames;
    return this._permissionService.isGrantedRoot(permissionNames);
  }
}
