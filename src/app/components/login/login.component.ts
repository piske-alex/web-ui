import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpService } from '../../providers/http/http.service';
import { RouteMap } from '../../models/route-map/route-map.modle';
import { Router } from '@angular/router';
import { CommonService } from '../../providers/common/common.service';
import { UserService } from '../../providers/user/user.service';
import { LanguageService } from '../../providers/language/language.service';

@Component({
  selector: 'gz-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  countryCode: any;
  countryCodes: any = [];
  phone: string;
  smsCode: string;
  password: string;
  resendSmsCodeDelay = 0;

  focusInput: string;
  isShowPassword: boolean;

  isLoading = false;

  i18ns: any = {};

  constructor(private location: Location,
    private router: Router,
    private userService: UserService,
    private httpService: HttpService,
    private languageService: LanguageService,
    private commonService: CommonService) {
  }

  async ngOnInit() {
    this.countryCode = '86';
    this.i18ns.inputPhone = await this.languageService.get('user.inputPhone');
    this.i18ns.inputSmsCode = await this.languageService.get('user.inputSmsCode');
    this.i18ns.resendSmsCode = await this.languageService.get('user.resendSmsCode');
    this.i18ns.inputPassword = await this.languageService.get('user.inputPassword');

    const _accessToken = localStorage.getItem('access_token');
    const _loginTimestamp = localStorage.getItem('login_timestamp');
    if (_accessToken && Date.now() - +_loginTimestamp < 1000 * 60 * 30) {
      this.router.navigate(['/home']);
    }

    try {
      this.countryCodes = await this.commonService.getCountryCodeList();
    } catch (e) {
      console.error(e);
    }
  }

  goBack() {
    // this.location.back();
    this.router.navigate(['/my']);
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
        phone: this.phone,
        action: 'login',
      });
    } catch (e) {
      console.error(e);
    }
  }

  login() {
    if (!this.phone) {
      return alert('请输入手机号码!');
    }

    if (!(/^[\d]{6,15}$/g.test(this.phone))) {
      return alert('请输入正确的手机号码!');
    }

    if (!this.password) {
      return alert('请输入密码!');
    }

    this.isLoading = true;

    const _params = {
      countryCallingCode: this.countryCode,
      phone: this.phone,
      password: this.password,
      verifyCode: this.smsCode,
    };

    this.httpService.request(RouteMap.V1.USER.LOGIN, _params).then(async (data) => {
      const _token = data && data.token;
      const _userId = data && data.userid;
      if (_token) {
        localStorage.setItem('access_token', _token);
        localStorage.setItem('login_timestamp', Date.now() + '');
        localStorage.setItem('user_id', _userId);
        delete _params.password;
        this.router.navigate(['/my', { userId: _userId }])
      } else {

      }
      const _user = await this.userService.getDetail({});
      if (_user) {
        localStorage.setItem('user', JSON.stringify(_user));
        if (!_user.username) {
          this.router.navigate(['setNickName', { userId: _user.id }]);
        }
      }
      this.isLoading = false;
    }, error => {
      console.error('---------------------error: ', error);
      this.password = '';
      if (error.error.success === false && error.error.errmsg !== undefined) {
        alert(error.error.errmsg);
      } else {
        this.resendSmsCodeDelay = 1;
        alert('手机号或者密码错误');
      }
      this.isLoading = false;
    });

  }


}
