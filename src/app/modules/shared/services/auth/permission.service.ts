import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IResponseItem } from '../../models/response.interface';
import { HttpClient } from '@angular/common/http';
import { finalize, takeUntil } from 'rxjs';
import { UtilDestroyService } from '../util-destroy.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  api = `${environment.api}`;

  permissionKeys = [];

  constructor(
    private http: HttpClient,
    private _destroyService: UtilDestroyService
  ) {}

  setPermissions(permissions: string[]): void {
    this.permissionKeys = permissions;
    localStorage.setItem('permissions', JSON.stringify(permissions)); // Lưu vào localStorage
  }

  // Hàm để lấy danh sách quyền
  getPermissions(): string[] {
    const savedPermissions = localStorage.getItem('permissions');
    if (savedPermissions) {
      this.permissionKeys = JSON.parse(savedPermissions);
    }
    return this.permissionKeys;
  }

  getCurrentPermission() {
    this.http
      .get<IResponseItem<any>>(
        `${this.api}/api/permission/get-permissions-by-user`
      )
      .pipe(takeUntil(this._destroyService))
      .subscribe({
        next: (res) => {
          this.setPermissions(res?.data);
        },
        error: (err) => {
          // console.log(err);
          throw err;
        },
      });
  }

  checkPermissions(body) {
    return this.http.post(`${this.api}/check-permission`, body);
  }

  isGrantedRoot(permissionNames: string[]): boolean {
    this.getPermissions(); // Lấy danh sách quyền từ localStorage (nếu cần)
    return permissionNames.every((permission) =>
      this.permissionKeys.includes(permission)
    );
  }
}
