import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentBase } from 'src/app/lib/components/component-base';
import { ImageUrlConst } from 'src/app/modules/shared/consts/base.const';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent extends ComponentBase {
  constructor(injector: Injector, private router: Router) {
    super(injector);
  }
  logoImage = ImageUrlConst.LogoImg;

  menuItems = [];
  isCollapse: boolean = false;
  ngOnInit() {
    this.setMenu();
  }

  changeMenuItem(urlLink) {
    this.router.navigate([urlLink]);
  }

  setMenu() {
    this.menuItems = [
      {
        icon: 'pi pi-home',
        label: 'Tổng quan',
        collapse: false,
        urlLink: '/',
        isShow: true,
      },
      {
        icon: 'pi pi-cog',
        label: 'Cài đặt ',
        isShow: this.isGranted(this.PermissionConst.MenuConfig),
        collapse: false,
        children: [
          {
            // icon: 'pi pi-cog',
            label: 'Cài đặt phân quyền',
            isShow: this.isGranted(this.PermissionConst.MenuRoleManager),
            urlLink: 'user/role',
            collapse: false,
            children: [],
          },
        ],
      },
    ];
  }

  toggleCollapse() {
    this.isCollapse = !this.isCollapse;
  }
}
