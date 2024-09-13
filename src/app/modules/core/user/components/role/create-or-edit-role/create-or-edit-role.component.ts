import { required } from 'src/app/modules/shared/validators/validator-common';
import { Component, Inject, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentBase } from 'src/app/lib/components/component-base';
import { RoleService } from '../../../services/role.service';
import { ToastService } from 'src/app/lib/components/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DIALOG_DATA, DialogConfig, DialogRef } from '@angular/cdk/dialog';

interface PermissionNode {
  permisisonKey: string;
  permissionLabel: string;
  parentKey: string;
  children?: PermissionNode[];
  checked?: boolean;
  collapsed?: boolean;
  indeterminate: boolean;
}

@Component({
  selector: 'app-create-or-edit-role',
  templateUrl: './create-or-edit-role.component.html',
  styleUrls: ['./create-or-edit-role.component.scss'],
})
export class CreateOrEditRoleComponent extends ComponentBase {
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private _roleService: RoleService,
    private dialogRef: DialogRef
  ) {
    super(injector);
  }

  postForm: FormGroup;
  permissionData: any;
  roleInfo: any;

  dataDialog: any;

  ngOnInit() {
    this.dataDialog = this.dialogRef.config?.data;
    this.getPermission();
    this.setForm();
    if (this.dataDialog.id) {
      this.getDetail();
    }
  }

  getPermission() {
    this._roleService.getPermissions().subscribe((res) => {
      if (this.checkStatusResponse(res)) {
        this.permissionData = this.handleData(res?.data);
      }
    });
  }

  setForm() {
    this.postForm = this.fb.group({
      id: [this.roleInfo?.id],
      name: [this.roleInfo?.name, required()],
      permissionKeys: [this.roleInfo?.permissionKey],
    });
  }

  getDetail() {
    const fillSelection = (permissionData: any[], permissionKeys: any[]) => {
      permissionData.forEach((node) => {
        if (permissionKeys.includes(node.permisisonKey)) {
          node.checked = true;
        }
        if (node.children && node.children.length > 0) {
          fillSelection(node.children, permissionKeys);
        }
      });
      return true;
    };
    this._roleService.getRoleById(this.dataDialog.id).subscribe((res) => {
      if (this.checkStatusResponse(res)) {
        this.roleInfo = res?.data;
        fillSelection(this.permissionData, this.roleInfo);
        // this.permissionData?.forEach((item) => {
        //   this.roleInfo?.permissionKeys.forEach((ri) => {
        //     if (item?.permisisonKey === ri) {
        //       item.checked = true;
        //     } else if (item.children.length > 0) {
        //       console.log('child', item.children);
        //       item.children.forEach((childItem) => {
        //         if (childItem.permissionKey === ri) {
        //           childItem.checked = true;
        //         }
        //       });
        //     }
        //   });
        // });

        console.log(11, this.permissionData);
        this.setForm();
      }
    });
  }

  //Xử lý tạo mảng permission theo định dạng:
  //[
  //  {
  //    parent {
  //        ...properties,
  //        childs: [...]
  //    }
  //  }
  //]
  handleData(permission: any[]) {
    const map: { [key: string]: PermissionNode } = {};
    const roots: PermissionNode[] = [];

    permission.forEach((item) => {
      map[item.permisisonKey] = {
        ...item,
        children: [],
        collapsed: true,
        indeterminate: false,
        checked: false,
      };
    });

    permission.forEach((item) => {
      if (item.parentKey) {
        map[item.parentKey].children.push(map[item.permisisonKey]);
      } else {
        roots.push(map[item.permisisonKey]);
      }
    });

    return roots;
  }

  onCheckChange(node: PermissionNode, isChecked: boolean): void {
    node.checked = isChecked;
    console.log(99292, node, this.permissionData);

    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => this.onCheckChange(child, isChecked));
    }

    this.checkParentNode(node, isChecked);
  }

  checkParentNode(node: PermissionNode, isCheckCurrent = true): void {
    if (!node.parentKey) {
      if (node.children.every((item) => item.checked)) {
        node.checked = true;
        node.indeterminate = false;
      } else if (
        node.children.some((item) => item.checked || item.indeterminate)
      ) {
        node.indeterminate = true;
      }
      return;
    }

    const parentNode = this.findNodeByKey(node.parentKey, this.permissionData);

    if (parentNode) {
      parentNode.indeterminate = true;
      const allChildrenChecked = parentNode.children.every(
        (child) => child.checked
      );

      const existChildrenChecked = parentNode.children.some(
        (item) => item.checked || item.indeterminate
      );
      //TH bỏ check
      if (!isCheckCurrent) {
        parentNode.indeterminate = false;
        parentNode.checked = false;
      }
      //TH check all
      if (allChildrenChecked) {
        parentNode.checked = true;
        parentNode.indeterminate = false;
      } else if (existChildrenChecked) {
        parentNode.indeterminate = true;
      }

      this.checkParentNode(parentNode, parentNode.checked);
    }
  }

  findNodeByKey(key: string, nodes: PermissionNode[]): PermissionNode | null {
    for (const node of nodes) {
      if (node.permisisonKey === key) {
        return node;
      } else if (node.children && node.children.length > 0) {
        const result = this.findNodeByKey(key, node.children);
        if (result) return result;
      }
    }
    return null;
  }

  toggleCollapse(node: PermissionNode): void {
    node.collapsed = !node.collapsed;
  }

  onRightClick(node: PermissionNode, event: MouseEvent): void {
    event.preventDefault();

    const isChecked = !node.checked;
    node.checked = isChecked;
    this.checkParentNode(node, isChecked);
  }

  close() {
    this.dialogRef.close();
  }

  handleDataSubmit() {
    let permisisonKeys = [];
    const collectPermissionKeys = (item) => {
      if (item?.checked || item?.indeterminate) {
        permisisonKeys.push(item?.permisisonKey);
      }

      if (item?.children && item?.children.length > 0) {
        item.children.forEach((childItem) => {
          collectPermissionKeys(childItem);
        });
      }
    };

    this.permissionData.forEach((item) => {
      collectPermissionKeys(item);
    });

    this.postForm.get('permissionKeys').setValue(permisisonKeys);
    console.log(this.postForm.get('permissionKeys').value);
  }

  onSubmit() {
    this.handleDataSubmit();
    if (this.checkInValidForm(this.postForm)) {
      this.messageError('Vui lòng kiểm tra lại các trường thông tin!');
    } else {
      if (this.dataDialog.id) {
        this._roleService
          .updateRole(this.postForm.getRawValue())
          .subscribe((res) => {
            if (this.checkStatusResponse(res)) {
              this._toastService.show({
                severity: 'success',
                summary: 'Chỉnh sửa thành công',
                detail: null,
                life: 3000,
              });
              this.close();
            }
          });
      } else {
        let body = this.postForm.getRawValue();
        console.log(body);
        delete body?.id;
        this._roleService.addRole(body).subscribe((res) => {
          if (this.checkStatusResponse(res)) {
            this._toastService.show({
              severity: 'success',
              summary: 'Thêm mới thành công',
              detail: null,
              life: 3000,
            });
            this.close();
          }
        });
      }
    }
  }
}
