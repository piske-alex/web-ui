import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { OtcAd } from '../../models/ad/OtcAd';
import { LanguageService } from '../../providers/language/language.service';
import { AdService } from '../../providers/ad/ad.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gz-my-ad',
  templateUrl: './my-ad.component.html',
  styleUrls: ['./my-ad.component.scss']
})
export class MyAdComponent implements OnInit {

  userId: string;
  status = 'active'; // old 1. 进行中， 10. 已下架   new status = (active=在架，hidden=下架)
  list: OtcAd[] = [];

  constructor(private location: Location,
    private router: Router,
    private languageService: LanguageService,
    private adService: AdService) {
  }

  ngOnInit() {
    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = localStorage.getItem('user_id');
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

  private async loadPublishAd() {
    const _params = {
      type: 'buy', // 'buy'
      country: '',
      coin: '',
      currency: '',
      payment: '',
      offset: 0,
      limit: 1000,
      userId: this.userId,
      status: this.status,
    };

    try {
      // this.adService.listOtcAd({ userId: this.userId, status: this.status });
      // this.isLoading = true;
      this.list =  await this.adService.listOtcAd(_params);
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
