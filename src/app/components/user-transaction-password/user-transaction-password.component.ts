import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../providers/user/user.service';
import { LanguageService } from '../../providers/language/language.service';
import { CommonService } from '../../providers/common/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gz-user-transaction-password',
  templateUrl: './user-transaction-password.component.html',
  styleUrls: ['./user-transaction-password.component.scss']
})
export class UserTransactionPasswordComponent implements OnInit {

  countryCode: string;
  countryCodes: any = [];
  phoneNo: string;
  smsCode: string;
  password: string;
  focusInput: string;
  isShowPassword: boolean;

  resendSmsCodeDelay: number;

  i18ns: any = {};

  constructor(private location: Location,
              private commonService: CommonService,
              private languageService: LanguageService,
              private router: Router,
              private userService: UserService) {
  }

  async ngOnInit() {
    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.countryCode = '86';
    try {
      this.countryCodes = await this.commonService.getCountryCodeList();
    } catch (e) {
      console.error(e);
    }

    this.i18ns.inputPhone = await this.languageService.get('user.inputPhone');
    this.i18ns.inputSmsCode = await this.languageService.get('user.inputSmsCode');
    this.i18ns.resendSmsCode = await this.languageService.get('user.resendSmsCode');
    this.i18ns.input_trans_password = await this.languageService.get('user_trans_password.input_trans_password');
    this.i18ns.inputValidPhone = await this.languageService.get('user.inputValidPhone');
    this.i18ns.err_phone_or_password = await this.languageService.get('user.err_phone_or_password');
    this.i18ns.err_gettoken_fail = await this.languageService.get('user.err_gettoken_fail');
    this.i18ns.err_getuserdetail_fail = await this.languageService.get('user.err_getuserdetail_fail');
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
      await this.commonService.sendSmsCode({
        countryCallingCode: this.countryCode,
        phone: this.phoneNo,
        action: 'resetPayPassword',
      });
    } catch (e) {
      console.error(e);
    }
  }

  async submit() {
    try {
      let _result = await this.userService.setTransactionPassword({
        verifyCode: this.smsCode,
        password: this.password
      });
      this.goBack();
    } catch (e) {
      console.error(e);
    }

    // // TODO delete
    // this.goBack();
    // // TODO delete end.
  }

}
