import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpService } from '../../providers/http/http.service';
import { RouteMap } from '../../models/route-map/route-map.modle';
import { Router } from '@angular/router';
import { CommonService } from '../../providers/common/common.service';
import { UserService } from '../../providers/user/user.service';
import { LanguageService } from '../../providers/language/language.service';
import { DialogService } from '../../providers/dialog/dialog.service';


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
    private commonService: CommonService,
    private dialogService: DialogService) {
  }

  async ngOnInit() {
    this.countryCode = '86';
    this.i18ns.inputPhone = await this.languageService.get('user.inputPhone');
    this.i18ns.inputSmsCode = await this.languageService.get('user.inputSmsCode');
    this.i18ns.resendSmsCode = await this.languageService.get('user.resendSmsCode');
    this.i18ns.inputPassword = await this.languageService.get('user.inputPassword');
    this.i18ns.inputValidPhone = await this.languageService.get('user.inputValidPhone');
    this.i18ns.err_phone_or_password = await this.languageService.get('user.err_phone_or_password');
    this.i18ns.err_gettoken_fail = await this.languageService.get('user.err_gettoken_fail');
    this.i18ns.err_getuserdetail_fail = await this.languageService.get('user.err_getuserdetail_fail');
    this.i18ns.err_usergroup_disabled = await this.languageService.get('user.err_usergroup_disabled');
    this.i18ns.invalid_verification_code = await this.languageService.get('user.invalid_verification_code');

    const _accessToken = localStorage.getItem('access_token');
    const _loginTimestamp = localStorage.getItem('login_timestamp');
    if (_accessToken && Date.now() - +_loginTimestamp < 1000 * 60 * 30) {
      this.router.navigate(['/home']);
    }

    try {
      this.countryCodes = await this.commonService.getCountryCodeList();
      console.log("version: 20190129")
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
    if (inputName === 'phone') {
      if (this.phone) {
        this.phone = this.phone.replace(/\s+/g, '');
      }
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
    if (!this.phone || this.phone.trim() == '') {
      return this.dialogService.alert(this.i18ns.inputPhone);
    }

    if (!(/^[\d]{6,15}$/g.test(this.phone))) {
      return this.dialogService.alert(this.i18ns.inputValidPhone);
    }

    if (!this.password) {
      return this.dialogService.alert(this.i18ns.inputPassword);
    }

    if (!this.smsCode) {
      return this.dialogService.alert(this.i18ns.inputSmsCode);
    }

    this.isLoading = true;

    const _params = {
      countryCallingCode: this.countryCode,
      phone: this.phone,
      password: this.password,
      verifyCode: this.smsCode,
    };

    try {
      this.password = '';
    this.httpService.request(RouteMap.V1.USER.LOGIN, _params).then(async (data) => {
      const _token = data && data.token;
      if (_token) {
          localStorage.setItem('access_token', _token);
          localStorage.setItem('login_timestamp', Date.now() + '');
          delete _params.password;

          this.userService.getDetail({}).then(async (data_user) => {
            const _user = data_user;
            if (_user) {
              localStorage.setItem('user_id', _user.id);
              localStorage.setItem('user', JSON.stringify(_user));
              this.languageService.initConfig(_user.language);
              localStorage.setItem('language', _user.language);
              if (!_user.username || _user.username == null) {
                this.router.navigate(['setNickName', { userId: _user.id || '' }]);
              } else {
                this.router.navigate(['/my', { userId: _user.id }]);
              }
            } else {
              this.dialogService.alert(this.i18ns.err_getuserdetail_fail);
              this.isLoading = false;
            }
          }, error_getuserdetail => {
            console.error('---------------------error_getuserdetail: ', error_getuserdetail);
            if (error_getuserdetail.status === 403 && error_getuserdetail.error.userGroup === 'guest') {
              this.router.navigate(['setNickName', { userId: '' }]);
            } else if (error_getuserdetail.status === 403 && error_getuserdetail.error.userGroup === 'disabled') {
              localStorage.removeItem('login_timestamp');
              localStorage.removeItem('access_token');
              this.dialogService.alert(this.i18ns.err_usergroup_disabled);
            } else if (error_getuserdetail.message == 'Unauthorized' ) {
              this.router.navigate(['setNickName', { }]);
            } else {
              localStorage.removeItem('login_timestamp');
              localStorage.removeItem('access_token');
              if (error_getuserdetail.message) {
                this.dialogService.alert(error_getuserdetail.message);
              }
            }
            this.isLoading = false;
          });
      } else {
        this.dialogService.alert(this.i18ns.err_gettoken_fail);
      }
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
      console.error('---------------------error: ', error);
      this.password = '';
      if (error.error.success === false && error.error.errmsg !== undefined) {
        if (error.error.errmsg == 'Invalid verification code') {
          this.dialogService.alert(this.i18ns.invalid_verification_code);
        } else {
          this.dialogService.alert(error.error.errmsg);
        }
      } else {
        this.resendSmsCodeDelay = 1;
        console.log ('error', error.error );
        if (error.error.errmsg) {
          if (error.error.errmsg == 'login or password wrong') {
            this.dialogService.alert(this.i18ns.err_phone_or_password); //
          } else {
            this.dialogService.alert(error.error.errmsg); // this.i18ns.err_phone_or_password
          }
        } else if (error.error.message) {
          this.dialogService.alert(error.error.message); // this.i18ns.err_phone_or_password
        } else if (error.error.error) {
          this.dialogService.alert(error.error.error);
        } else {
          this.dialogService.alert('Serve error');
        }
      }
      this.isLoading = false;
    });

  } catch (e) {
    this.isLoading = false;
    console.error('catch eee ', e);
    // this.dialogService.alert(e && e.errMsg || this.i18ns.publishError);
  }

  }



}
