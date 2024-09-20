import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/modules/shared/environments/environment';
import { IResponseList } from 'src/app/modules/shared/models/response.interface';

@Injectable({
  providedIn: 'root',
})
export class KeyPermissionService {
  api = `${environment.api}/api/permission`;
  constructor(private http: HttpClient) {}

  getListApi(): Observable<IResponseList<any>> {
    let params = new HttpParams().set('pageSize', -1);
    return this.http.get<IResponseList<any>>(
      `${this.api}/get-all-permission-of-api`,
      { params }
    );
  }

  createPermissionApi(body) {
    return this.http.post(`${this.api}/create-permission-for-api`, body);
  }
}
