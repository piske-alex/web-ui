import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { User } from '../../models/user/user';
import { LanguageService } from '../../providers/language/language.service';
import { UserService } from '../../providers/user/user.service';
import { Router } from '@angular/router';
import { DialogService } from '../../providers/dialog/dialog.service';

@Component({
  selector: 'gz-trust-list',
  templateUrl: './trust-list.component.html',
  styleUrls: ['./trust-list.component.scss']
})
export class TrustListComponent implements OnInit {
  userId: string;
  relationShip = 1;

  list: User[] = [];

  i18ns: any = {};
  isLoading: boolean;

  constructor(private location: Location,
    private router: Router,
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

    this.userId = localStorage.getItem('user_id');
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.i18ns.iDealWithHimCount = await this.languageService.get('user.iDealWithHimCount');
    this.i18ns.iTrusted = await this.languageService.get('user.iTrusted');
    this.i18ns.trustedMe = await this.languageService.get('user.trustedMe');
    this.i18ns.iBlackList = await this.languageService.get('user.iBlackList');
    this.i18ns.trustManage = await this.languageService.get('user.trustManage');
    this.i18ns.transaction = await this.languageService.get('common.transaction');

    this.i18ns.cancel_trust = await this.languageService.get('trust.cancel_trust');
    this.i18ns.cancel_black = await this.languageService.get('trust.cancel_black');

    this.getUserList();
  }

  goBack() {
    this.location.back();
  }

  getDealWithHimDesc(data) {
    if (this.i18ns.iDealWithHimCount) {
      return this.i18ns.iDealWithHimCount.replace('${1}', data.deal_with_me_count || 0);
    } else {
      return '';
    }
  }

  loadList(relationShip) {
    this.relationShip = relationShip;
    this.getUserList();
  }


  private async getUserList() {
    try {
      this.isLoading = true;
      this.list = await this.userService.getUserList({ relationship: this.relationShip });
      this.isLoading = false;
      // console.log('trust getUserList', this.list);
    } catch (e) {
      console.error(e);
      this.dialogService.alert(e.error);
    }

  }



  async cancelBlackList(anotherUserId: string) {
    try {
      this.isLoading = true;
      let _result = await this.userService.addBlackList({userid: anotherUserId, action: 'remove'});
      this.isLoading = false;
      this.getUserList();
    } catch (e) {
      console.error(e);
      this.dialogService.alert(e.error);
    }
  }

  async cancelTrustList(anotherUserId: string) {
    try {
      this.isLoading = true;
      let _result = await this.userService.addTrustList({userid: anotherUserId, action: 'remove'});
      this.isLoading = false;
      this.getUserList();
    } catch (e) {
      console.error(e);
      this.dialogService.alert(e.error);
    }
  }



}
