import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from './providers/http/http.service';
import { LanguageService } from './providers/language/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLoginSuccess: boolean;

  private language: string = localStorage.getItem('language') || 'zh-CN';

  constructor(private httpService: HttpService,
              private router: Router,
              private languageService: LanguageService) {
    // ###### change language
    // setTimeout(() => {
    //   this.language = 'en';
    //   this._initTranslateConfig();
    // }, 5000);
  }

  ngOnInit(): void {
    // this.isLoginSuccess = localStorage.getItem('access_token') ? true : false;
    // if (!this.isLoginSuccess) {
    //   this.goToLogin();
    // }

    if (innerWidth < 1200) {
      setTimeout(() => {
        (<any>document.querySelector('.gz-landing-page')).style.display = 'none';
      }, 2000);
    }

    this.httpService.getAuthMessage().subscribe(data => {
      this.isLoginSuccess = data;
      if (!this.isLoginSuccess) {
        console.log('####### to login');
        this.goToLogin();
      }
    });

    this.languageService.onChange().subscribe(code => {
      if (this.languageService.list.includes(code)) {
        this.language = code;
        this.languageService.initConfig(this.language);
      }
    });

    this.languageService.initConfig(this.language);

    this.router.navigate(['/home']);

    setInterval(() => {
      let _accessToken = localStorage.getItem('access_token');
      let _loginTimestamp = localStorage.getItem('login_timestamp');
      if (_accessToken && (!_loginTimestamp || Date.now() - +_loginTimestamp > 1000 * 60 * 10)) {
        localStorage.removeItem('access_token');
      }
    }, 1000);
  }

  goToLogin() {
    this.router.navigate(['/login', {}]);
    setTimeout(() => {
      this.router.navigate(['/login', {}]);
    }, 25);
  }

}
