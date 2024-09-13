import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, of } from 'rxjs';
import { environment } from 'src/app/modules/shared/environments/environment';
import { TokenService } from 'src/app/modules/shared/services/auth/token.service';

@Injectable()
export class AuthService {
  api = environment.api;
  constructor(private http: HttpClient, private _tokenService: TokenService) {}
  login(username, password) {
    return this.http
      .post(`${this.api}/api/auth/login`, { username, password })
      .pipe(
        concatMap((response: any) => {
          this._tokenService.setToken(response.data?.accessToken);
          return of(response);
        })
      );
  }
}
