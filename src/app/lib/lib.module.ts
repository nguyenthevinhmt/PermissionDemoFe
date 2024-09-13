import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './components/toast/toast.service';
import { TreeComponent } from './components/tree/tree.component';
import { LibHelperService } from '../modules/shared/services/lib-helper.service';
import { InputDirective } from './directives/input.directive';
import { LibButtonDirective } from './directives/lib-button.directive';
import { DynamicDialogComponent } from './components/dynamic-dialog/dynamic-dialog.component';

@NgModule({
  declarations: [
    ToastComponent,
    TreeComponent,
    InputDirective,
    LibButtonDirective,
    DynamicDialogComponent,
  ],
  imports: [CommonModule],
  exports: [ToastComponent, TreeComponent, InputDirective, LibButtonDirective],
  providers: [ToastService, LibHelperService],
})
export class LibModule {}
