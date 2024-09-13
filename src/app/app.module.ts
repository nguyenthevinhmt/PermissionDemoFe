import { PermissionService } from './modules/shared/services/auth/permission.service';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LibModule } from './lib/lib.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HandleInterceptor } from './modules/shared/providers/handle.interceptor';
import { GlobalErrorHandler } from './modules/shared/providers/global-error-handle';
import { LibHelperService } from './modules/shared/services/lib-helper.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    LibModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HandleInterceptor,
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    LibHelperService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
