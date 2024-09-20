import { required } from 'src/app/modules/shared/validators/validator-common';
import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentBase } from 'src/app/lib/components/component-base';
import { RoleService } from '../../../services/role.service';
import { DialogRef } from '@angular/cdk/dialog';
import { forkJoin, Observable } from 'rxjs';

interface PermissionNode {
  permissionKey: string;
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

  isShowSaveButton = true;

  postForm: FormGroup;
  permissionData: any;
  roleInfo: any;

  dataDialog: any;

  ngOnInit() {
    this.dataDialog = this.dialogRef.config?.data;
    let apis = [this._roleService.getPermissions()];
    this.setForm();
    if (this.dataDialog.id) {
      apis[1] = this._roleService.getRoleById(this.dataDialog.id);
      this.isShowSaveButton = this.isGranted(
        this.PermissionConst.ButtonUpdateRole
      );
      forkJoin(apis).subscribe(([permissionData, detailData]) => {
        if (this.checkStatusResponse(permissionData)) {
          this.permissionData = this.handleData(permissionData?.data);
        }
        if (this.checkStatusResponse(detailData)) {
          this.roleInfo = detailData?.data;
          this.handleGetDetailTree(detailData?.data?.permissionKeys);
          this.setForm();
        }
      });
    } else {
      this.getPermission();
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
      permissionKeys: [this.roleInfo?.permissionKeys],
    });
  }

  getDetail() {
    this._roleService.getRoleById(this.dataDialog.id).subscribe((res) => {
      if (this.checkStatusResponse(res)) {
        this.roleInfo = res?.data;
        this.handleGetDetailTree(res?.data?.permissionKeys);
        this.setForm();
      }
    });
  }

  handleGetDetailTree(data: string[]) {
    const markParentIndeterminate = (node: PermissionNode) => {
      let pNode = this.findNodeByKey(node.parentKey, this.permissionData);
      // pNode.indeterminate = true;
      this.checkParentNode(node);
      if (pNode.parentKey) {
        markParentIndeterminate(pNode);
      }
    };

    const updateCheckedParent = (traceNodes: any[], node: PermissionNode) => {
      if (
        traceNodes?.length === node.children.length &&
        traceNodes.every((item) => item.checked === true)
      ) {
        if (!node.parentKey) {
          if (
            !node.children.length ||
            node.children?.every((item) => item.indeterminate)
          ) {
            node.checked = true;
            node.indeterminate = false;
          } else if (node.children?.some((item) => item.indeterminate)) {
            node.checked = false;
            node.indeterminate = true;
          }
        }
        //check xem các node cùng cấp với node cha có đang check all không
        else if (node.parentKey) {
          let parentNode = this.findNodeByKey(
            node.parentKey,
            this.permissionData
          );
          if (parentNode) {
            let traceNodeParent = [];
            parentNode.children.forEach((item) => {
              traceNodeParent.push(item);
            });
            updateCheckedParent(traceNodeParent, parentNode);
          }
        }
      }
    };

    const markCheckedChildNode = (
      node: PermissionNode,
      permissionKey: string
    ) => {
      let traceNodes = [];
      node.children.forEach((item) => {
        let childNode = this.findNodeByKey(item.permissionKey, node.children);
        if (childNode) {
          traceNodes.push(childNode);
          if (childNode?.permissionKey === permissionKey) {
            childNode.checked = true;
            markParentIndeterminate(childNode);
          } else if (childNode.children.length) {
            markCheckedChildNode(childNode, permissionKey);
          }
        }
      });
      updateCheckedParent(traceNodes, node);
    };

    this.permissionData?.forEach((item: PermissionNode) => {
      data?.forEach((dataItem: string) => {
        //case menu gốc (parent root)
        if (item.permissionKey === dataItem) {
          item.checked = true;
          markCheckedChildNode(item, dataItem);
        }
        //case menu con (child)
        if (item.children?.length) {
          item.children?.forEach((childItem) => {
            let checkChildNode = this.findNodeByKey(
              childItem.permissionKey,
              item.children
            );
            markCheckedChildNode(checkChildNode, dataItem);
          });
        }
      });
    });
  }

  //Xử lý tree permission
  handleData(node: PermissionNode[]) {
    return node.map((item) => {
      if (item.children) {
        item.children = this.handleData(item.children);
      }
      return {
        ...item,
        collapsed: true,
        indeterminate: false,
        checked: false,
      };
    });
  }

  onCheckChange(node: PermissionNode, isChecked: boolean): void {
    node.checked = isChecked;
    node.indeterminate = false;

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
      // //TH bỏ check
      if (!isCheckCurrent) {
        parentNode.indeterminate = false;
        parentNode.checked = false;
      }
      // //TH check all
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
    for (let node of nodes) {
      if (node.permissionKey === key) {
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
    let permissionKey = [];
    const collectPermissionKeys = (item) => {
      if (item?.checked || item?.indeterminate) {
        permissionKey.push(item?.permissionKey);
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

    this.postForm.get('permissionKeys').setValue(permissionKey);
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
