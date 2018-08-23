import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { UserService } from "../../providers/user/user.service";
import { CommonService } from "../../providers/common/common.service";

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
              private userService: UserService) {
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
      await this.commonService.sendSmsCode({countryCallingCode: this.countryCode, phone: this.phoneNo});
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
