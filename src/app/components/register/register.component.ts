import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonService } from '../../providers/common/common.service';
import { UserService } from '../../providers/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gz-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  countryCode: any;
  countryCodes: any = [];
  phoneNo: string;
  smsCode: string;
  password: string;
  resendSmsCodeDelay = 0;

  passwordWarn = '';

  focusInput: string;
  isShowPassword: boolean;
  isAggreeTerms: boolean;

  i18ns: any = {};

  constructor(private location: Location,
              private router: Router,
              private userService: UserService,
              private commonService: CommonService) {
  }

  async ngOnInit() {
    this.countryCode = '86';
    try {
      this.countryCodes = await this.commonService.getCountryCodeList();
    } catch (e) {
      console.error(e);
    }
  }

  goBack() {
    this.location.back();
  }

  focus(inputName: string) {
    this.focusInput = inputName;

    if (inputName === 'password') {
      this.passwordWarn = '';
    }
  }

  blur(inputName: string) {
    if (this.focusInput === inputName) {
      this.focusInput = '';
    }

    if (inputName === 'password') {
      this._validatePassword();
    }
  }

  isFocus(inputName: string): string {
    return this.focusInput === inputName ? 'active' : '';
  }

  showPassword(show: boolean) {
    this.isShowPassword = show;
  }

  async sendSmsCode() {
    this.resendSmsCodeDelay = 60;
    const _delayInterval = setInterval(() => {
      if (--this.resendSmsCodeDelay === 0) {
        clearInterval(_delayInterval);
      }
    }, 1000);

    try {
      await this.commonService.sendSmsCode({countryCallingCode: this.countryCode, phone: this.phoneNo});
    } catch (e) {
      console.error(e);
    }
  }

  async register() {

    if (!this._validatePassword()) {
      return;
    }

    const _params = {
      countryCallingCode: this.countryCode,
      phone: this.phoneNo,
      verifyCode: this.smsCode,
      password: this.password,
      agree: this.isAggreeTerms,
    };
    try {
      const _result = await this.userService.register(_params);
      const _userId = _result.userId || '';
      const _token = _result.token;
      localStorage.setItem('user_id', _userId);
      localStorage.setItem('access_token', _token);

      this.router.navigate(['/setNickName', {userId: _userId}]);
    } catch (e) {
      console.error(e);
    }

    // // TODO delete
    // this.router.navigate(['/setNickName', {userId: '123'}]);
    // // TODO delete end.
  }

  private _validatePassword(): boolean {
    this.password = this.password || '';
    if (this.password.length < 8) {
      this.passwordWarn = '请输入最少8位密码，其中(一个数字，一个小写英文字母，一个大写英文字母)!';
    } else if (!/[A-Z]{1,}/g.test(this.password) || !/[a-z]{1,}/g.test(this.password) || !/[\d]{1,}/g.test(this.password)) {
      this.passwordWarn = '密码至少包含一个数字，一个小写英文字母，一个大写英文字母!';
    } else {
      this.passwordWarn = '';
    }
    return this.passwordWarn.length === 0;
  }

}
