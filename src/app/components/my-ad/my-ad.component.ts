import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { OtcAd } from "../../models/ad/OtcAd";
import { LanguageService } from "../../providers/language/language.service";
import { AdService } from "../../providers/ad/ad.service";

@Component({
  selector: 'gz-my-ad',
  templateUrl: './my-ad.component.html',
  styleUrls: ['./my-ad.component.scss']
})
export class MyAdComponent implements OnInit {

  userId: string;
  status: number = 1; // 1. 进行中， 10. 已下架
  list: OtcAd[] = [];

  constructor(private location: Location,
              private languageService: LanguageService,
              private adService: AdService) {
  }

  ngOnInit() {
    this.userId = localStorage.getItem('user_id');
    this.loadPublishAd();
  }

  goBack() {
    this.location.back();
  }

  selectProcessing() {
    this.status = 1;
    this.loadPublishAd();
  }

  selectObtained() {
    this.status = 10;
    this.loadPublishAd();
  }

  private async loadPublishAd() {
    try {
      this.adService.listOtcAd({publishUserId: this.userId, status: this.status});
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
