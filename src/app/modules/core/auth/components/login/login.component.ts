import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ComponentBase } from 'src/app/lib/components/component-base';
import { required } from 'src/app/modules/shared/validators/validator-common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends ComponentBase {
  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private _authService: AuthService,
    private router: Router
  ) {
    super(injector);
  }

  postForm: FormGroup;
  errorMsg: string;

  LoginBackgroundImg = ''; //LoginBackgroundImg;

  ngOnInit() {
    this.postForm = this.fb.group({
      username: [null, [required()]],
      password: [null, [required()]],
    });
  }

  get formValue() {
    return this.postForm.value;
  }

  onSubmit() {
    if (this.checkInValidForm(this.postForm)) {
      this.errorMsg = 'Vui lòng điền đầy đủ thông tin đăng nhập';
    } else {
      this._authService
        .login(this.formValue?.username, this.formValue?.password)
        .subscribe((res) => {
          if (res?.data) {
            this.router.navigate(['/']);
          }
        });
    }
  }
}
