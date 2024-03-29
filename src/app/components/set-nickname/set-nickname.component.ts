import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../providers/user/user.service';
import { LanguageService } from '../../providers/language/language.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../providers/dialog/dialog.service';


@Component({
  selector: 'gz-set-nickname',
  templateUrl: './set-nickname.component.html',
  styleUrls: ['./set-nickname.component.scss']
})
export class SetNicknameComponent implements OnInit {

  focusInput: string;

  userId: string;
  nickname: string;

  i18ns: any = {};

  constructor(private location: Location,
              private router: Router,
              private route: ActivatedRoute,
              private languageService: LanguageService,
              private userService: UserService,
              private dialogService: DialogService) {
  }

  async ngOnInit() {
    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = this.route.snapshot.paramMap.get('userId');
    this.i18ns.input_nickname = await this.languageService.get('user.input_nickname');
    this.i18ns.err_username_had_used = await this.languageService.get('user.err_username_had_used');
    this.i18ns.submit_fail = await this.languageService.get('user_real_cert.submit_fail');
    this.i18ns.err_username_had_setted = await this.languageService.get('user.err_username_had_setted');
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

  async submit() {
    if (!this.nickname || this.nickname.trim() == '') {
      return this.dialogService.alert(this.i18ns.input_nickname);
    }

    try {
      const tempUserId = this.userId;
      this.userService.setNickname({username: this.nickname}).then( (data) => {
        console.log(data);
        this.router.navigate(['/my', {userId: tempUserId}]);
      }, err => {
        if (err.error) {
          if (err.error == 'username have been used') {
            return this.dialogService.alert(this.i18ns.err_username_had_used);
          } else {
            if (err.status === 403 && err.error.userGroup === 'user') {
              this.dialogService.alert(this.i18ns.err_username_had_setted);
            } else {
              this.dialogService.alert(this.i18ns.submit_fail);
            }
          }
        }
      });
    } catch (e) {
      if (e.status === 403 && e.error.userGroup === 'user') {
        this.dialogService.alert(this.i18ns.err_username_had_setted);
      } else {
        this.dialogService.alert(this.i18ns.submit_fail);
      }
    }

  }
  formatChar(value) {
    //event.target.value = event.target.value.replace(/[^\w\u4e00-\u9fa5\-\s]/gi, '');
    let v = value.replace(/[^\w\u4e00-\u9fa5\-]/gi, '');
    this.nickname = v;
  }
}
