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
  isShowLoadMore = false;

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
      limit: 15,
      userid: this.userId,
      status: this.status // 'active hidden'
    };

    try {
      // this.adService.listOtcAd({ userId: this.userId, status: this.status });
      // this.isLoading = true;
      let _result = await this.adService.listTransactionList(_params);
      this.list = _result.list;

      if (_result.total > this.list.length) {
        this.isShowLoadMore = true;
      } else {
        this.isShowLoadMore = false;
      }
    } catch (e) {
      console.error(e);
    }

  }


  async loadMorePublishAd() {
    let currentListLength = 0;
    if (this.list) {
      currentListLength = this.list.length;
    }

    const _params = {
      type: '', // 'sell buy'
      country: '',
      coin: '',
      currency: '',
      payment: '',
      offset: currentListLength,
      limit: 10,
      userid: this.userId,
      status: this.status // 'active hidden'
    };

    try {
      // this.adService.listOtcAd({ userId: this.userId, status: this.status });
      // this.isLoading = true;
      let _result = await this.adService.listTransactionList(_params);
      if (this.list) {
        const tempList = this.list.concat(_result.list);
        this.list = tempList;
        // let len = _result.list.length;
        // for (let i = 0; i < len; i++) {
        //   this.adList.push(_result.list[i]);
        // }
      } else {
        this.list = _result.list;
      }

      if (_result.total > this.list.length) {
        this.isShowLoadMore = true;
      } else {
        this.isShowLoadMore = false;
      }
    } catch (e) {
      console.error(e);
    }

  }


}
