import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleComponent } from './components/role/role.component';
import { CreateOrEditRoleComponent } from './components/role/create-or-edit-role/create-or-edit-role.component';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { ConfigPermissionComponent } from './components/config-permission/config-permission.component';
import { CreateOrEditPermissionConfigComponent } from './components/config-permission/create-or-edit-permission-config/create-or-edit-permission-config.component';

const routes: Routes = [
  {
    path: 'role',
    children: [
      { path: '', component: RoleComponent },
      { path: 'create', component: CreateOrEditRoleComponent },
      { path: 'detail/:id', component: CreateOrEditRoleComponent },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'permission-config',
    children: [
      { path: '', component: ConfigPermissionComponent },
      { path: 'create', component: CreateOrEditPermissionConfigComponent },
      // { path: 'detail/:id', component: CreateOrEditRoleComponent },
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
