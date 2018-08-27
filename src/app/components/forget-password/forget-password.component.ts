import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { CommonService } from "../../providers/common/common.service";
import { UserService } from "../../providers/user/user.service";
import { Router } from "@angular/router";

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

  isShowPassword: boolean;
  focusInput: string;

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
    // // TODO delete
    // this.countryCodes = [
    //   {code: '86', name: '中国'},
    //   {code: '852', name: '中国香港'},
    // ];
    // // TODO delete end.
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

    this.commonService.sendSmsCode({countryCallingCode: this.countryCode, phone: this.phoneNo});
  }

  async submit() {

    if (!(/^[\d]{6,15}$/g.test(this.phoneNo))) {
      return alert('请输入正确的手机号码!');
    }

    let _params = {
      countryCallingCode: this.countryCode,
      phone: this.phoneNo,
      verifyCode: this.smsCode,
      password: this.password,
    };
    try {
      await this.userService.forgetPassword(_params);
      this.router.navigate(['/login']);
    } catch (e) {
      console.error(e);
    }

  }

}
