import { DialogRef } from '@angular/cdk/dialog';
import { Component, Injector } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ComponentBase } from 'src/app/lib/components/component-base';
import { BaseConsts } from 'src/app/modules/shared/consts/base.const';
import { required, requiredArray } from 'src/app/modules/shared/validators/validator-common';
import { KeyPermissionService } from '../../../services/key-permission.service';
import { RoleService } from '../../../services/role.service';
import { forkJoin, Observable } from 'rxjs';
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
    let apis : Observable<any>[] = [this._roleService.getPermissions()];
    this.getPermissionTree();
    this.dataDialog = this.dialogRef.config?.data;
    this.setForm();
    if(this.dataDialog?.id) {
      apis[1] = this._keyPermissionService.getById(this.dataDialog?.id)
      forkJoin(apis).subscribe(([treeData, detailData]) => {
        if(this.checkStatusResponse(treeData)) {
          this.handleTree(treeData);
        }
        if(this.checkStatusResponse(detailData)) {
          this.permissionApiInfo = detailData?.data;
          this.setForm();
        }
      })
    }
    else{
      this.getPermissionTree()
    }

  }

  setForm() {
    this.postForm = this.fb.group({
      id: [this.permissionApiInfo?.id],
      path: [this.permissionApiInfo?.path, required()],
      description: [this.permissionApiInfo?.description, required()],
      permissionKeys: this.fb.array([], requiredArray("* Vui lòng thêm ít nhất 1 quyền truy cập cho api")),
    });


    if(this.permissionApiInfo?.keyPermissions) {
      this.setPermissionKeys(this.permissionApiInfo?.keyPermissions)
    }

    if(!this.dataDialog?.id) {
      this.postForm.removeControl('id');
      this.addTerm();
    }
  }

  handleChildItem = (childData) => {
    if (childData?.children && childData?.children?.length) {
      childData.children = this.handleChildItem(childData.children)
    }
    childData = childData.map(item => {
      if(item?.children && item?.children?.length) {
        item.children =  this.handleChildItem(item.children)
      }
      return {
        ...item,
        key: `${item?.id}`,
        label: item.permissionLabel,
        data: item.permissionKey
      };
    })
    return childData;
  };

  handleTree(response) {
    this.permissionTree = response?.data?.map(item => {
      if (item?.children && item?.children?.length) {
        item.children = this.handleChildItem(item.children)
      }
      return {
        ...item,
        key: `${item?.id}`,
        label: item.permissionLabel,
        data: item.permissionKey
      };
    });
  }

  getPermissionTree() {
    this._roleService.getPermissions().subscribe(res => {
      if (this.checkStatusResponse(res)) {
        this.handleTree(res);
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
          parentId: [detail.parent],
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
            parentId: item.parentId?.key
          }
        })
      }

      let api = !this.dataDialog.id ?  this._keyPermissionService.createPermissionApi(body) : this._keyPermissionService.update(body);
      let message = !this.dataDialog.id ?  "Thêm mới thành công" : "Cập nhật thành công";

      api.subscribe(res => {
        if(this.checkStatusResponse(res, message)) {
          this.dialogRef.close();
        }
      })
    }
  }
}
