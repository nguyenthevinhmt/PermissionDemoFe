import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { TokenService } from '../services/auth/token.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PermissionService } from '../services/auth/permission.service';
import { StatusResponseConst } from '../consts/base.const';
import { ToastService } from 'src/app/lib/components/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private _tokenService: TokenService,
    private router: Router,
    private _permissionService: PermissionService,
    private _toastService: ToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return of(this._tokenService.getToken()).pipe(
      map((token) => {
        if (token) {
          return true;
        } else {
          return this.router.createUrlTree(['/auth/login']);
        }
      }),
      catchError((error) => {
        return of(this.router.createUrlTree(['/auth/login']));
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.canActivate(route, state);
  }
}
