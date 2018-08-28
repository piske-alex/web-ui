import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../providers/common/common.service";
import { Location } from "@angular/common";
import { UserService } from "../../providers/user/user.service";

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

  constructor(private commonService: CommonService,
              private userService: UserService,
              private location: Location) {
  }

  ngOnInit() {
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
    try {
    // , verifyCode: this.emailVerifyCode
      let _result = await this.userService.bindEmail({email: this.email});
      this.goBack();
    } catch (e) {
      console.error(e);
    }
  }
}
