import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Authorization } from '../../consts/base.const';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private _cookieService: CookieService) {}

  getToken() {
    return this._cookieService.get('access-token');
  }

  deleteAccessToken() {
    this._cookieService.delete(Authorization.accessToken, '/');
  }

  setToken(accessToken: string) {
    this._cookieService.set(Authorization.accessToken, accessToken, null, '/');
  }

  clearAllToken() {
    this._cookieService.deleteAll();
  }
}
