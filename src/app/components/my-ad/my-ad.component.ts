import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { OtcAd } from '../../models/ad/OtcAd';
import { LanguageService } from '../../providers/language/language.service';
import { AdService } from '../../providers/ad/ad.service';
import { Router } from '@angular/router';
import { TransactionListItem } from '../../models/ad/TransactionListItem';


@Component({
  selector: 'gz-my-ad',
  templateUrl: './my-ad.component.html',
  styleUrls: ['./my-ad.component.scss']
})
export class MyAdComponent implements OnInit {

  userId: string;
  status = 'active'; // old 1. 进行中， 10. 已下架   new status = (active=在架，hidden=下架)
  list: TransactionListItem[] = [];
  i18ns: any = {};

  constructor(private location: Location,
    private router: Router,
    private languageService: LanguageService,
    private adService: AdService) {
  }

  async ngOnInit() {
    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }


    this.i18ns.confirm_obtained = await this.languageService.get('transaction.confirm_obtained');

    this.userId = localStorage.getItem('user_id');
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadPublishAd();
  }

  goBack() {
    this.location.back();
  }

  selectProcessing() {
    this.status = 'active';
    this.loadPublishAd();
  }

  selectObtained() {
    this.status = 'hidden';
    this.loadPublishAd();
  }

 async loadPublishAd() {
    const _params = {
      type: '', // 'sell buy'
      country: '',
      coin: '',
      currency: '',
      payment: '',
      offset: 0,
      limit: 1000,
      userid: this.userId,
      status: this.status // 'active hidden'
    };

    try {
      // this.adService.listOtcAd({ userId: this.userId, status: this.status });
      // this.isLoading = true;
      let _result = await this.adService.listTransactionList(_params);
      this.list = _result.list;
      console.log('myads', this.list);
      // this.isLoading = false;
    } catch (e) {
      console.error(e);
    }

    // // TODO delete
    // this.list = [
    //   {
    //     adType: '1',
    //     status: Math.floor(Math.random() * 100) % 2 === 0 ? 1 : 10,
    //     coinType: 'coinType',
    //     country: 'country',
    //     currency: 'currency',
    //     price: 'price',
    //     premium: 'premium',
    //     maxPrice: 'maxPrice',
    //     minCount: 'minCount',
    //     maxCount: 'maxCount',
    //     payType: 'payType',
    //     payTerm: 'payTerm',
    //     remark: 'remark',
    //     isOnlyTrustUser: 'isOnlyTrustUser',
    //     isOnlyRealUser: 'isOnlyRealUser',
    //     openTimeType: 'openTimeType',
    //     openTime: 'openTime',
    //     userId: 'userId',
    //   }
    // ];
    // // TODO delete end.
  }



}
