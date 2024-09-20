import { ToastService } from './../../../lib/components/toast/toast.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, EMPTY, finalize, Observable } from 'rxjs';
import { TokenService } from '../services/auth/token.service';
import { EErrorCode } from '../consts/errorCode.const';
import { BaseConsts } from '../consts/base.const';

@Injectable()
export class HandleInterceptor implements HttpInterceptor {
  constructor(
    private _tokenService: TokenService,
    private _toastService: ToastService
  ) {}

  requestPostApi: string;

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const url = new URL(request?.url);
    let token: string = this._tokenService.getToken();
    const method: string = request.method;

    const methodCreateOrUpdates = ['POST', 'PUT', 'PATCH'];
    const paramRemoves = ['unAuthorize', 'enableMultileRequest'];
    const unAuthorize = request.params.get('unAuthorize') === true.toString();
    const enableMultileRequest = !!request.params.get('enableMultileRequest');
    if (methodCreateOrUpdates.includes(method) && !enableMultileRequest) {
      if (request.url !== this.requestPostApi) {
        this.requestPostApi = request.url;
      } else {
        return EMPTY;
      }
    }

    let params = new HttpParams();
    let paramKeys = request.params.keys();
    //
    paramKeys.forEach((key) => {
      // Get value full của key nếu nhiều value thì for append mới truyền key nhiều giá trị được
      if (!paramRemoves.includes(key)) {
        request.params.getAll(key).forEach((value) => {
          params = params.append(key, value);
        });
      }
    });

    // Add Token to api
    if (token) {
      let headers = !unAuthorize ? { Authorization: `Bearer ${token}` } : {};
      request = request.clone({
        setHeaders: headers,
        params: params,
      });
    }
    return next.handle(request).pipe(
      finalize(() => {
        this.requestPostApi = '';
      }),
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err?.status === EErrorCode.Unauthorized) {
            console.log(111, err);
            this._toastService.show({
              severity: 'error',
              summary: 'Tài khoản không có quyền truy cập!',
            });
            this._tokenService.deleteAccessToken();
            window.location.href = '/auth/login';
            // window.location.href = '/';
            // return;
          }
          // else if (err?.status === EErrorCode.Unauthorized && !err.message) {
          //   this._toastService.show({
          //     severity: 'error',
          //     summary: 'Hết hạn đăng nhập, vui lòng đăng nhập lại',
          //   });
          //   this._tokenService.deleteAccessToken();
          //   window.location.href = '/auth/login';
          //   // return;
          // }
          else {
            let message: string = '';
            let statusCode: number = err?.status;
            switch (statusCode) {
              case EErrorCode.NotFound:
                message = 'Đường dẫn không tồn tại';
                break;
              case EErrorCode.Unauthorized:
                message = 'Tài khoản không có quyền truy cập';
                break;
              case EErrorCode.Forbidden:
                message = err?.error?.message || err?.message;
                break;
              default:
                message = BaseConsts.messageError;
            }
          }
        }
        throw err;
      })
    );
  }
}
