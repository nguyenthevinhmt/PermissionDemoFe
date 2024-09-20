import {
  Component,
  ElementRef,
  inject,
  Injector,
  Renderer2,
} from '@angular/core';
import { ComponentBase } from 'src/app/lib/components/component-base';
import { KeyPermissionService } from '../../services/key-permission.service';
import { Dialog } from '@angular/cdk/dialog';
import { CreateOrEditPermissionConfigComponent } from './create-or-edit-permission-config/create-or-edit-permission-config.component';

@Component({
  selector: 'app-config-permission',
  templateUrl: './config-permission.component.html',
  styleUrls: ['./config-permission.component.scss'],
})
export class ConfigPermissionComponent extends ComponentBase {
  dialog = inject(Dialog);
  constructor(
    injector: Injector,
    private _keyPermissionService: KeyPermissionService,
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

  rows: any[];
  columns: any;
  listAction: any[];

  ngOnInit() {
    this.setPage();
  }

  setPage() {
    this._keyPermissionService.getListApi().subscribe((res) => {
      if (this.checkStatusResponse(res)) {
        this.rows = res?.data?.items;
        this.getListAction(this.rows);
      }
    });
  }

  setColumn() {
    this.columns = [
      {
        header: 'id',
        label: 'ID',
      },
      {
        header: 'path',
        label: 'Path',
      },
      {
        header: 'description',
        label: 'Mô tả',
      },
    ];
  }

  getListAction(data) {
    this.listAction = data.map((item) => {
      const actions = [];
      if (true) {
        actions.push({
          data: item,
          label: 'Thông tin chi tiết',
          icon: 'pi pi-info-circle',
          command: ($event) => {
            this.detail($event.item.data);
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

  detail(data) {
    const dialogRef = this.dialog.open(CreateOrEditPermissionConfigComponent, {
      width: '1200px',
      autoFocus: false,
      data: {
        header: 'Thông tin chi tiết',
        id: data?.id,
      },
    });

    dialogRef.closed.subscribe((result) => {
      this.setPage();
    });
    this.closeDropdown();
  }

  create() {
    const dialogRef = this.dialog.open(CreateOrEditPermissionConfigComponent, {
      width: '1200px',
      autoFocus: false,
      data: {
        header: 'Thêm mới',
        // id: data?.id,
      },
    });

    dialogRef.closed.subscribe((result) => {
      this.setPage();
    });
  }
}
