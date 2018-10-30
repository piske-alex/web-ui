import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../providers/user/user.service';
import { User } from '../../models/user/user';
import { LanguageService } from '../../providers/language/language.service';
import { DialogService } from '../../providers/dialog/dialog.service';

@Component({
  selector: 'gz-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.scss']
})
export class UserSettingComponent implements OnInit {

  userId: string;
  user: User = new User();
  i18ns: any = {};

  constructor(private location: Location,
    private userService: UserService,
    private router: Router,
    private languageService: LanguageService,
    private dialogService: DialogService) {
  }

  async ngOnInit() {
    this.userId = localStorage.getItem('user_id');
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    // try {
    //   const _user = localStorage.getItem('user');
    //   if (_user) {
    //     this.user = JSON.parse(_user);
    //   }
    // } catch (e) {
    //   console.error(e);
    // }
    this.user = await this.userService.getDetail({ id: this.userId });
    // console.error(this.user);
    this.i18ns.set_paypass_first = await this.languageService.get('user_setting.set_paypass_first');
  }

  goBack() {
    // this.location.back();
    this.router.navigate(['/my']);
  }

  goToVerify() {
    if (!this.user.payPass ) {
      return this.dialogService.alert(this.i18ns.set_paypass_first);
     } else {
      if (!this.user.kycStatus  || this.user.kycStatus === 'unverified' ) {
        this.router.navigate(['/userRealCert']);
       }
     }
  }

  goToBindEmail() {
    if (!this.user.emailStatus || this.user.emailStatus === 'unset') {
      this.router.navigate(['/userEmail']);
    }
 }

}
