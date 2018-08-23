import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../../providers/user/user.service";
import { User } from "../../models/user/user";
import { LanguageService } from "../../providers/language/language.service";
import { AdService } from "../../providers/ad/ad.service";
import { Deal } from "../../models/ad/Deal";
import { TransactionListItem } from "../../models/ad/TransactionListItem";

@Component({
  selector: 'gz-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userId: string;
  coinType: string;
  data: User = new User();

  publishList: TransactionListItem[] = [];
  dealWithMeList: Deal[] = [];

  i18ns: any = {};

  isSelectPublish = true;

  constructor(private location: Location,
              private route: ActivatedRoute,
              private languageService: LanguageService,
              private adService: AdService,
              private userService: UserService) {
  }

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.coinType = this.route.snapshot.paramMap.get('coinType');

    this.i18ns.hisPublishAd = await this.languageService.get('user.hisPublishAd');
    this.i18ns.iDealWithHim = await this.languageService.get('user.iDealWithHim');

    this.loadPublishList();
  }

  goBack() {
    this.location.back();
  }

  private async loadPublishList() {
    try {
      let _params = {
        type: '',
        country: '',
        coin: '',
        currency: '',
        payment: '',
        offset: 0,
        limit: 1000,
        userid: this.userId,
      };
      let _result = await this.adService.listTransactionList(_params);
      this.publishList = _result.list;
    } catch (e) {
      console.error(e);
    }

  }

  private async loadDealList() {
    try {
      this.dealWithMeList = await this.adService.listDealList({otherUserId: this.userId});
    } catch (e) {
      console.error(e);
    }

    // // TODO delete
    // this.dealWithMeList = [
    //   {
    //     adId: 'adId',
    //     adType: 'adType',
    //     adUserId: 'adUserId',
    //     adUsername: 'adUsername',
    //     adAmount: '50000',
    //     adCurrency: 'HKY',
    //     adCoinType: '',
    //     dealUserId: 'dealUserId',
    //     dealUsername: 'dealUsername',
    //     dealAmount: '100',
    //     dealCurrency: '',
    //     dealCoinType: 'BTC',
    //
    //   }
    // ];
    // // TODO delete end.
  }

  selectPublish() {
    this.isSelectPublish = true;
    this.loadPublishList();
  }

  selectDeal() {
    this.isSelectPublish = false;
    this.loadDealList();
  }
}
