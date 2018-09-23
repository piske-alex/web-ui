import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../providers/common/common.service';
import { Location } from '@angular/common';
import { UserService } from '../../providers/user/user.service';
import { LanguageService } from '../../providers/language/language.service';

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
              private location: Location) {
  }

  async ngOnInit() {
    this.i18ns.input_email = await this.languageService.get('user_email.input_email');
    this.i18ns.input_valid_email = await this.languageService.get('user_email.input_valid_email');
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
      return alert(this.i18ns.input_email);
    }

    if (!(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/g.test(this.email))) {
      return alert(this.i18ns.input_valid_email);
    }

    try {
      // , verifyCode: this.emailVerifyCode
      // let _result = await this.userService.bindEmail({email: this.email});
      this.userService.bindEmail({email: this.email}).then(async (data) => {
          alert('绑定Email成功');
          this.goBack();
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
