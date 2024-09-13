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

@NgModule({
  declarations: [RoleComponent, CreateOrEditRoleComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    HttpClientModule,
    LibModule,
    ReactiveFormsModule,
    DialogModule,
  ],
  providers: [RoleService, LibHelperService],
})
export class UserModule {}
