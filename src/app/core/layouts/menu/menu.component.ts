import { Component, Injector } from '@angular/core';
import { ComponentBase } from 'src/app/lib/components/component-base';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent extends ComponentBase {
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit() {}

  setMenu() {}
}
