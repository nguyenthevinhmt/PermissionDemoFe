import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/lib/components/toast/toast.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LibHelperService {
  constructor(
    public toastService: ToastService,
    // public dialogService: DialogService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  messageError(msg = '', summary = '', life = 2500) {
    this.toastService.show({
      severity: 'error',
      summary,
      detail: msg,
      life: life,
    });
  }

  messageSuccess(msg = '', summary = '', life = 2000) {
    this.toastService.show({
      severity: 'success',
      summary,
      detail: msg,
      life: life,
    });
  }

  messageWarn(msg = '', life = 3000) {
    this.toastService.show({
      severity: 'warn',
      summary: '',
      detail: msg,
      life: life,
    });
  }
}
