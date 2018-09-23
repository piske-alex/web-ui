import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonService } from '../../providers/common/common.service';
import { UserService } from '../../providers/user/user.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../providers/language/language.service';

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
  i18ns: any = {};

  constructor(private location: Location,
              private router: Router,
              private userService: UserService,
              private languageService: LanguageService,
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

    this.i18ns.inputPhone = await this.languageService.get('user.inputPhone');
    this.i18ns.inputSmsCode = await this.languageService.get('user.inputSmsCode');
    this.i18ns.resendSmsCode = await this.languageService.get('user.resendSmsCode');
    this.i18ns.set_login_password = await this.languageService.get('forget_password.set_login_password');
    this.i18ns.inputValidPhone = await this.languageService.get('user.inputValidPhone');
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

    this.commonService.sendSmsCode({
      countryCallingCode: this.countryCode,
      phone: this.phoneNo,
      action: 'resetPassword',
    });
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
      // await this.userService.forgetPassword(_params);
      try {
        this.userService.forgetPassword(_params).then(async (data) => {
            alert('修改密码成功,请重新登录');
            await this.userService.logout();
            localStorage.removeItem('user_id');
            localStorage.removeItem('user');
            localStorage.removeItem('login_timestamp');
            localStorage.removeItem('access_token');
            this.router.navigate(['/login']);
        }, error => {
          console.error('----------------bindEmail-----error: ', error);
          if (error.error.success === false && error.error.errmsg !== undefined) {
            alert(error.error.errmsg);
          } else {
            alert('绑定Email失败');
          }
        });

    } catch (e) {
      console.error(e);
    }

  }

}
