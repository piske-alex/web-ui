import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonService } from '../../providers/common/common.service';
import { UserService } from '../../providers/user/user.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../providers/language/language.service';
import { DialogService } from '../../providers/dialog/dialog.service';

@Component({
  selector: 'gz-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  countryCode: any;
  countryCodes: any;
  phoneNo: string;
  smsCode: string;
  password: string;
  resendSmsCodeDelay: number = 0;
  passwordWarn: string = '';

  isShowPassword: boolean;
  focusInput: string;
  i18ns: any = {};

  constructor(private location: Location,
              private router: Router,
              private userService: UserService,
              private languageService: LanguageService,
              private commonService: CommonService,
              private dialogService: DialogService
              ) {
  }

  async ngOnInit() {
    this.countryCode = '86';
    try {
      this.countryCodes = await this.commonService.getCountryCodeList();
    } catch (e) {
      console.error(e);
    }
    // // TODO delete
    // this.countryCodes = [
    //   {code: '86', name: '中国'},
    //   {code: '852', name: '中国香港'},
    // ];
    // // TODO delete end.

    const _user = JSON.parse(localStorage.getItem('user'));
    if (_user) {
      this.countryCode  =  _user.countryCallingCode;
      this.phoneNo = _user.phone;
    }

    this.i18ns.inputPhone = await this.languageService.get('user.inputPhone');
    this.i18ns.inputSmsCode = await this.languageService.get('user.inputSmsCode');
    this.i18ns.resendSmsCode = await this.languageService.get('user.resendSmsCode');
    this.i18ns.set_login_password = await this.languageService.get('forget_password.set_login_password');
    this.i18ns.input_login_password = await this.languageService.get('forget_password.input_login_password');
    this.i18ns.inputValidPhone = await this.languageService.get('user.inputValidPhone');
    this.i18ns.setting_password_relogin = await this.languageService.get('user.setting_password_relogin');
    this.i18ns.setting_password_fail = await this.languageService.get('user.setting_password_fail');
    this.i18ns.invalid_verification_code = await this.languageService.get('user.invalid_verification_code');
    this.i18ns.password_valid_warn_1 = await this.languageService.get('register.password_valid_warn_1');
    this.i18ns.password_valid_warn_2 = await this.languageService.get('register.password_valid_warn_2');
    this.i18ns.phone_mismatch = await this.languageService.get('user.phone_mismatch');
  }

  goBack() {
    this.location.back();
  }

  focus(inputName: string) {
    this.focusInput = inputName;
  }

  blur(inputName: string) {
    if (this.focusInput === inputName) {
      this.focusInput = '';
    }
    if (inputName === 'password') {
      this._validatePassword();
    }
    if (inputName === 'phoneNo') {
      this.phoneNo = this.phoneNo.replace(/\s+/g,'');
    }
  }

  showPassword(show: boolean) {
    this.isShowPassword = show;
  }

  isFocus(inputName: string): string {
    return this.focusInput === inputName ? 'active' : '';
  }


  sendSmsCode() {
    this.resendSmsCodeDelay = 60;
    let _delayInterval = setInterval(() => {
      if (--this.resendSmsCodeDelay === 0) {
        clearInterval(_delayInterval);
      }
    }, 1000);

    this.commonService.sendSmsCode({
      countryCallingCode: this.countryCode,
      phone: this.phoneNo,
      action: 'resetPassword',
    });
  }

  async submit() {

    if (!this.phoneNo) {
      return this.dialogService.alert(this.i18ns.inputPhone);
    }

    if (!(/^[\d]{6,15}$/g.test(this.phoneNo))) {
      return this.dialogService.alert(this.i18ns.inputValidPhone);
    }

    if (!this.password) {
      return this.dialogService.alert(this.i18ns.input_login_password);
    }

    if (!this.smsCode) {
      return this.dialogService.alert(this.i18ns.inputSmsCode);
    }

    let _params = {
      countryCallingCode: this.countryCode,
      phone: this.phoneNo,
      verifyCode: this.smsCode,
      password: this.password,
    };
      // await this.userService.forgetPassword(_params);
      try {
        this.userService.forgetPassword(_params).then(async (data) => {
          this.dialogService.alert(this.i18ns.setting_password_relogin);
            await this.userService.logout();
            localStorage.removeItem('user_id');
            localStorage.removeItem('user');
            localStorage.removeItem('login_timestamp');
            localStorage.removeItem('access_token');
            this.router.navigate(['/login']);
        }, error => {
          console.error('----------------forgetPassword-----error: ', error);
          if (error.success === false) {
            if (error.error === 'user not found') {
              this.dialogService.alert(this.i18ns.inputValidPhone);
            }
          } else if (error.error.success === false && error.error.errmsg !== undefined) {
            if (error.error.errmsg == 'Invalid verification code') {
              this.dialogService.alert(this.i18ns.invalid_verification_code);
            } else if (error.error.errmsg == 'phone number mismatch') {
              this.dialogService.alert(this.i18ns.phone_mismatch);
            } else {
              this.dialogService.alert(error.error.errmsg);
            }
          } else {
            this.dialogService.alert(this.i18ns.setting_password_fail);
          }
        });

    } catch (e) {
      console.error(e);
    }

  }

  private _validatePassword(): boolean {
    this.password = this.password || '';
    if (this.password.length < 8) {
      this.passwordWarn = this.i18ns.password_valid_warn_1;
    } else if (!/[A-Z]{1,}/g.test(this.password) || !/[a-z]{1,}/g.test(this.password) || !/[\d]{1,}/g.test(this.password)) {
      this.passwordWarn = this.i18ns.password_valid_warn_2;
    } else {
      this.passwordWarn = '';
    }
    return this.passwordWarn.length === 0;
  }

}
