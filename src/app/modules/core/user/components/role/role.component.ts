import { RoleConst } from './../../const/role.const';
import {
  Component,
  ElementRef,
  inject,
  Injector,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { ComponentBase } from 'src/app/lib/components/component-base';
import { RoleService } from '../../services/role.service';
import {
  Dialog,
  DialogRef,
  DIALOG_DATA,
  DialogModule,
} from '@angular/cdk/dialog';
import { CreateOrEditRoleComponent } from './create-or-edit-role/create-or-edit-role.component';
import { PermissionService } from 'src/app/modules/shared/services/auth/permission.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss'],
})
export class RoleComponent extends ComponentBase {
  dialog = inject(Dialog);
  constructor(
    injector: Injector,
    private router: Router,
    private _roleService: RoleService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    super(injector);
    this.renderer.listen(
      'document',
      'click',
      this.handleClickOutside.bind(this)
    );
  }

  columns = [];
  row: any;
  action: any;
  RoleConst = RoleConst;

  ngOnInit() {
    this.setPage();
  }

  setPage() {
    this._roleService.getRole().subscribe((res) => {
      if (this.checkStatusResponse(res)) {
        this.row = res?.data?.items;
        if (this.row?.length) {
          this.getListAction(this.row);
        }
      }
    });
  }

  setColumn() {
    this.columns = [
      {
        header: 'name',
        label: 'Tên quyền',
      },
      {
        header: 'status',
        label: 'Trạng thái',
      },
    ];
  }

  getListAction(data) {
    this.action = data.map((item) => {
      const status = item?.status;
      const actions = [];
      if (this.isGranted(this.PermissionConst.ButtonDetailRole)) {
        actions.push({
          data: item,
          label: 'Thông tin chi tiết',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.detail($event.item.data);
          },
        });
      }
      if (this.isGranted(this.PermissionConst.ButtonUpdateStatusRole)) {
        actions.push({
          data: item,
          label: status == 1 ? 'Hủy kích hoạt' : 'Kích hoạt',
          icon: status == 2 ? 'pi pi-lock' : 'pi pi-unlock',
          command: ($event) => {
            this.changeStatus($event.item.data);
          },
        });
      }
      return actions;
    });
  }

  activeDropdown: number | null = null;

  toggleDropdown(index: number): void {
    if (this.activeDropdown === index) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = index;
    }
  }

  detail(data) {
    const dialogRef = this.dialog.open(CreateOrEditRoleComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        header: 'Thông tin chi tiết',
        id: data?.id,
      },
    });

    dialogRef.closed.subscribe((result) => {
      this.setPage();
    });
  }

  changeStatus(data) {
    console.log(data);
    this.closeDropdown();
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  // Handle clicks outside the dropdown
  handleClickOutside(event: Event) {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  create(): void {
    const dialogRef = this.dialog.open(CreateOrEditRoleComponent, {
      width: '500px',
      autoFocus: false,
      data: {
        header: 'Thông tin chi tiết',
      },
    });

    dialogRef.closed.subscribe((result) => {
      this.setPage();
    });
  }
}
