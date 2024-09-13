import { ComponentBase } from './lib/components/component-base';
import { ToastService } from './lib/components/toast/toast.service';
import { Component, Injector } from '@angular/core';
import { LibHelperService } from './modules/shared/services/lib-helper.service';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {
  title = 'PermissionDemo';
}
