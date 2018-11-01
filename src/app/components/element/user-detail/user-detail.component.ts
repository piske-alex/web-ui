import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../providers/user/user.service';
import { LanguageService } from '../../../providers/language/language.service';
import { DialogService } from '../../../providers/dialog/dialog.service';

@Component({
  selector: 'gz-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  // 'money', 'trustBtn'
  @Input()
  rightTop: string;

  // 点击头像跳转url
  @Input()
  headHrefUrl: string;

  @Input()
  userId: string;

  @Input()
  coinType: string;

  @Input()
  rightTopTxt: string;

  @Input()
  leftTopTxt: string;

  @Input()
  remark: string;

  data: any = {};

  i18ns: any = {};

  constructor(private router: Router,
              private languageService: LanguageService,
              private userService: UserService,
              private dialogService: DialogService) {
  }

  async ngOnInit() {
    this.i18ns.blackList = await this.languageService.get('common.blackList');
    this.i18ns.trust = await this.languageService.get('common.trust');
    this.i18ns.cancel_trust = await this.languageService.get('trust.cancel_trust');
    this.i18ns.cancel_black = await this.languageService.get('trust.cancel_black');
    this.i18ns.cancel = await this.languageService.get('common.cancel');
    this.i18ns.transactionCount = await this.languageService.get('otc.transactionCount');
    this.i18ns.trustCount = await this.languageService.get('otc.trustCount');
    this.i18ns.praiseCount = await this.languageService.get('otc.praiseCount');
    this.i18ns.historyDeal = await this.languageService.get('otc.historyDeal');
    this.i18ns.iDealWithHimCount = await this.languageService.get('user.iDealWithHimCount');

    try {
      this.data = await this.userService.getDetail({userid: this.userId});

    } catch (e) {
      console.error(e);
    }
  }

  showUserDetail() {
    if (this.headHrefUrl) {
      this.router.navigate([this.headHrefUrl, {userId: this.userId, coinType: this.data.historyDealCoinType || ''}]);
    }
  }

  getLeftTopTxt() {
    if (this.leftTopTxt) {
      return this.leftTopTxt;
    } else if (this.i18ns.iDealWithHimCount) {
      return this.i18ns.iDealWithHimCount.replace('${1}', this.data.deal_with_me_count || 0);
    } else {
      return '';
    }
  }

  async addBlackList() {
    try {
      let _result = await this.userService.addBlackList({userid: this.userId, action: 'add'});
      this.data.is_in_my_black_list = true;
      this.data = await this.userService.getDetail({userid: this.userId});
    } catch (e) {
      console.error(e);
      this.dialogService.alert(e.error);
    }
  }

  async addTrustList() {
    try {
      let _result = await this.userService.addTrustList({userid: this.userId, action: 'add'});
      this.data.is_in_my_trust_list = true;
      this.data = await this.userService.getDetail({userid: this.userId});
    } catch (e) {
      console.error(e);
      this.dialogService.alert(e.error);
    }
  }

  async cancelBlackList() {
    try {
      let _result = await this.userService.addBlackList({userid: this.userId, action: 'remove'});
      this.data.is_in_my_black_list = false;
      this.data = await this.userService.getDetail({userid: this.userId});
    } catch (e) {
      console.error(e);
      this.dialogService.alert(e.error);
    }
  }

  async cancelTrustList() {
    try {
      let _result = await this.userService.addTrustList({userid: this.userId, action: 'remove'});
      this.data.is_in_my_trust_list = false;
      this.data = await this.userService.getDetail({userid: this.userId});
    } catch (e) {
      console.error(e);
      this.dialogService.alert(e.error);
    }
  }
}
