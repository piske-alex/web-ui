import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { User } from "../../models/user/user";
import { LanguageService } from "../../providers/language/language.service";
import { UserService } from "../../providers/user/user.service";
import { Router } from '@angular/router';

@Component({
  selector: 'gz-trust-list',
  templateUrl: './trust-list.component.html',
  styleUrls: ['./trust-list.component.scss']
})
export class TrustListComponent implements OnInit {

  relationShip = 1;

  list: User[] = [];

  i18ns: any = {};

  constructor(private location: Location,
    private router: Router,
    private languageService: LanguageService,
    private userService: UserService) {
  }

  async ngOnInit() {
    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.i18ns.iDealWithHimCount = await this.languageService.get('user.iDealWithHimCount');
    this.i18ns.iTrusted = await this.languageService.get('user.iTrusted');
    this.i18ns.trustedMe = await this.languageService.get('user.trustedMe');
    this.i18ns.iBlackList = await this.languageService.get('user.iBlackList');
    this.i18ns.trustManage = await this.languageService.get('user.trustManage');
    this.i18ns.transaction = await this.languageService.get('common.transaction');

    this.getUserList();
  }

  goBack() {
    this.location.back();
  }

  getDealWithHimDesc(data) {
    if (this.i18ns.iDealWithHimCount) {
      return this.i18ns.iDealWithHimCount.replace('${1}', data.dealWithMeCount || 0);
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
      this.list = await this.userService.getUserList({ relationship: this.relationShip });
    } catch (e) {
      console.error(e);
    }

  }

}
