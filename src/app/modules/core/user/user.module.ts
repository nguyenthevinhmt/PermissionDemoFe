import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { CreateOrEditRoleComponent } from './components/role/create-or-edit-role/create-or-edit-role.component';
import { RoleComponent } from './components/role/role.component';
import { RoleService } from './services/role.service';
import { HttpClientModule } from '@angular/common/http';
import { LibModule } from 'src/app/lib/lib.module';
import { LibHelperService } from '../../shared/services/lib-helper.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@angular/cdk/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { ConfigPermissionComponent } from './components/config-permission/config-permission.component';
import { CreateOrEditPermissionConfigComponent } from './components/config-permission/create-or-edit-permission-config/create-or-edit-permission-config.component';

@NgModule({
  declarations: [
    RoleComponent,
    CreateOrEditRoleComponent,
    ConfigPermissionComponent,
    CreateOrEditPermissionConfigComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    HttpClientModule,
    LibModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    TreeSelectModule
  ],
  providers: [RoleService, LibHelperService],
})
export class UserModule {}
