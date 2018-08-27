import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpService } from '../../providers/http/http.service';
import { RouteMap } from '../../models/route-map/route-map.modle';
import { Router } from '@angular/router';
import { CommonService } from '../../providers/common/common.service';

@Component({
  selector: 'gz-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  countryCode: any;
  countryCodes: any = [];
  phone: string;
  password: string;

  focusInput: string;
  isShowPassword: boolean;

  constructor(private location: Location,
              private router: Router,
              private httpService: HttpService,
              private commonService: CommonService) {
  }

  async ngOnInit() {
    this.countryCode = '86';

    let _accessToken = localStorage.getItem('access_token');
    let _loginTimestamp = localStorage.getItem('login_timestamp');
    if (_accessToken && Date.now() - _loginTimestamp < 1000 * 60 * 10) {
      this.router.navigate(['/home']);
    }

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

    let _params = {
      countryCallingCode: this.countryCode,
      phone: this.phone,
      password: this.password,
    };

    this.httpService.request(RouteMap.V1.USER.LOGIN, _params).then(data => {
      let _token = data && data.token;
      let _userId = data && data.userid;
      if (_token) {
        localStorage.setItem('access_token', _token);
        localStorage.setItem('login_timestamp', Date.now());
        localStorage.setItem('user_id', _userId);
        delete _params.password;
        this.router.navigate(['/my', {userId: _userId}])
      } else {

      }
    }, error => {
      console.error('---------------------error: ', error);
      this.password = '';
      alert('手机号或者密码错误');
    });

  }

}
