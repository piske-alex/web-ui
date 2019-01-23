import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../providers/common/common.service';
import { Location } from '@angular/common';
import { UserService } from '../../providers/user/user.service';
import { LanguageService } from '../../providers/language/language.service';
import { DialogService } from '../../providers/dialog/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gz-user-email',
  templateUrl: './user-email.component.html',
  styleUrls: ['./user-email.component.scss']
})
export class UserEmailComponent implements OnInit {

  email: string;
  emailVerifyCode: string;
  focusInput: string;
  resendEmailVerifyCodeDelay: number;
  i18ns: any = {};

  constructor(private commonService: CommonService,
              private userService: UserService,
              private languageService: LanguageService,
              private location: Location,
              private router: Router,
              private dialogService: DialogService) {
  }

  async ngOnInit() {
    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.i18ns.input_email = await this.languageService.get('user_email.input_email');
    this.i18ns.input_valid_email = await this.languageService.get('user_email.input_valid_email');
    this.i18ns.bind_email_success = await this.languageService.get('user_email.bind_email_success');
    this.i18ns.bind_email_success_need_active = await this.languageService.get('user_email.bind_email_success_need_active');
    this.i18ns.bind_email_failure = await this.languageService.get('user_email.bind_email_failure');
    this.i18ns.bind_failure_email_existed = await this.languageService.get('user_email.bind_failure_email_existed');
    this.i18ns.bind_failure_email_verified = await this.languageService.get('user_email.bind_failure_email_verified');

  }

  goBack() {
    this.location.back();
  }

  isFocus(inputName: string): string {
    return this.focusInput === inputName ? 'active' : '';
  }

  async sendEmailVerifyCode() {
    this.resendEmailVerifyCodeDelay = 60;
    let _delayInterval = setInterval(() => {
      if (--this.resendEmailVerifyCodeDelay === 0) {
        clearInterval(_delayInterval);
      }
    }, 1000);

    try {
      await this.userService.sendEmailVerifyCode({email: this.email});
    } catch (e) {
      console.error(e);
    }
  }

  async submit() {
    if (!this.email) {
      return this.dialogService.alert(this.i18ns.input_email);
    }

    if (!(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/g.test(this.email))) {
      return this.dialogService.alert(this.i18ns.input_valid_email);
    }

    try {
      // , verifyCode: this.emailVerifyCode
      // let _result = await this.userService.bindEmail({email: this.email});
      this.userService.bindEmail({email: this.email}).then(async (data) => {
        this.dialogService.alert(this.i18ns.bind_email_success_need_active);
          // this.goBack();
          this.router.navigate(['/userSetting']);
      }, error => {
        if (error.success === false && error.error == 'email existed') {
          this.dialogService.alert(this.i18ns.bind_failure_email_existed);
        } else if (error.success === false && error.error == 'email verified') {
          this.dialogService.alert(this.i18ns.bind_failure_email_verified);
        } else if (error.success === false && error.error !== undefined) {
          this.dialogService.alert(error.error.errmsg);
        } else {
          this.dialogService.alert(this.i18ns.bind_email_failure);
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
}
