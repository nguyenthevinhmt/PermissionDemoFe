import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ComponentBase } from 'src/app/lib/components/component-base';
import { BaseConsts } from 'src/app/modules/shared/consts/base.const';
import { required, requiredArray } from 'src/app/modules/shared/validators/validator-common';
import { KeyPermissionService } from '../../../services/key-permission.service';
import { RoleService } from '../../../services/role.service';
@Component({
  selector: 'app-create-or-edit-permission-config',
  templateUrl: './create-or-edit-permission-config.component.html',
  styleUrls: ['./create-or-edit-permission-config.component.scss'],
})
export class CreateOrEditPermissionConfigComponent extends ComponentBase {
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private dialogRef: DialogRef,
    private _keyPermissionService: KeyPermissionService,
    private _roleService: RoleService
  ) {
    super(injector);
  }

  postForm: FormGroup;
  permissionApiInfo: any;

  dataDialog: any;
  permissionTree = [];

  ngOnInit() {
    this.getPermissionTree();
    this.dataDialog = this.dialogRef.config?.data;
    this.setForm();
    if(this.dataDialog?.id) {
      this.getDetail();
    }

    setTimeout(() => {
      console.log("tree", this.permissionTree)
    }, 2000)
  }

  setForm() {
    this.postForm = this.fb.group({
      id: [this.permissionApiInfo?.id],
      path: [this.permissionApiInfo?.path, required()],
      description: [this.permissionApiInfo?.description, required()],
      permissionKeys: this.fb.array([], requiredArray("Vui lòng thêm ít nhất 1 quyền truy cập cho api")),
    });

    if(!this.dataDialog?.id) {
      this.postForm.removeControl('id');
      this.addTerm();
    }
  }

  getPermissionTree() {
    let handleChildItem = (childData) => {
      if (childData.children && childData.children.length) {
        childData.children = childData.children.map(handleChildItem); // Map the children properly
      }
      return {
        ...childData,
        key: `${childData?.id}`,
        label: childData.permissionLabel,
        data: childData.permissionKey
      };
    };

    this._roleService.getPermissions().subscribe(res => {
      if (this.checkStatusResponse(res)) {
        this.permissionTree = res?.data?.map(item => {
          if (item?.children && item.children.length) {
            item.children = item.children.map(handleChildItem); // Process children here
          }
          return {
            ...item,
            key: `${item?.id}`,
            label: item.permissionLabel,
            data: item.permissionKey
          };
        });
      }
    });
  }

  get permissionKeys() {
    return this.postForm.controls['permissionKeys'] as FormArray;
  }

  get formControl() {
    return this.postForm.controls;
  }

  get formRawValue() {
    return this.postForm.getRawValue();
  }

  getDetail() {}

  addTerm() {
    let body: any[] = [
      {
        permissionKey: null,
        permissionLabel: null,
        parentId: null,
        orderPriority: null,
      },
    ];
    this.setPermissionKeys(body)
  }

  removeTerm(index) {
    this.permissionKeys.removeAt(index)
  }

  setPermissionKeys(data) {
    if (data && data.length > 0) {
      const detailArray = this.postForm.get('permissionKeys') as FormArray;
      data.forEach((detail) => {
        let detailGroup: FormGroup;
        detailGroup = this.fb.group({
          permissionKey: [detail.permissionKey, required()],
          permissionLabel: [detail.permissionLabel, required()],
          parentId: [detail.parentId],
          orderPriority: [detail.orderPriority, required()],
        });

        detailArray.push(detailGroup);
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  onSubmit() {
    if(this.checkInValidForm(this.postForm)) {
      this.messageError(BaseConsts.formError);
      return;
    }
    else {
      let body = {
        ...this.formRawValue,
        permissionKeys: this.formRawValue.permissionKeys.map(item => {
          return {
            ...item,
            parentId: item.parentId.id
          }
        })
      }

      console.log("form", this.formRawValue)
      let api = !this.dataDialog.id ?  this._keyPermissionService.createPermissionApi(body) : this._keyPermissionService.createPermissionApi(body);
      let message = !this.dataDialog.id ?  "Thêm mới thành công" : "Cập nhật thành công";

      api.subscribe(res => {
        if(this.checkStatusResponse(res, message)) {
          this.dialogRef.close();
        }
      })
    }
  }
}
