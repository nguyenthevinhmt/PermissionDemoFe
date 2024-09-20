import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/modules/shared/environments/environment';
import {
  IResponseItem,
  IResponseList,
} from 'src/app/modules/shared/models/response.interface';

@Injectable()
export class RoleService {
  api = `${environment.api}/api`;
  constructor(private http: HttpClient) {}

  getPermissions(): Observable<any> {
    return this.http.get(`${this.api}/permission/get-permission-tree`);
  }

  getRole(): Observable<IResponseList<any>> {
    let params = new HttpParams().set('pageSize', 1).set('pageIndex', 25);
    return this.http.get<IResponseList<any>>(`${this.api}/role/find-all`, {
      params,
    });
  }

  getRoleById(id: number): Observable<IResponseItem<any>> {
    return this.http.get<IResponseList<any>>(
      `${this.api}/role/find-by-id/${id}`
    );
  }

  addRole(body: any) {
    return this.http.post(`${this.api}/role/create`, body);
  }

  updateRole(body: any) {
    return this.http.put(`${this.api}/role/update`, body);
  }
}
