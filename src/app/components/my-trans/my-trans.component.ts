import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TradeItem } from '../../models/common/TradeItem';
import { LanguageService } from '../../providers/language/language.service';
import { CommonService } from '../../providers/common/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gz-my-trans',
  templateUrl: './my-trans.component.html',
  styleUrls: ['./my-trans.component.scss']
})
export class MyTransComponent implements OnInit {

  userId: string;
  status = 'active'; // old 1. 进行中， 10. 已下架   new status = (active=在架，hidden=下架)
  list: TradeItem[] = [];
  adType: string; // buy sell
  total: number;
  isLoading: boolean;
  isShowLoadMore:boolean;

  constructor(private location: Location,
    private router: Router,
    private languageService: LanguageService,
    private cmService: CommonService) {
  }

  ngOnInit() {
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
    this.isLoading = true;
    this.adType = 'buy';
    this.loadTrade();
    //this.isLoading = false;
  }

  goBack() {
    this.location.back();
  }

  selectProcessing() {
    this.status = 'active';
    this.adType = 'buy';
    this.loadTrade();
  }

  selectObtained() {
    this.status = 'hidden';
    this.adType = 'sell';
    this.loadTrade();
  }

  private async loadTrade() {
    const _params = {
      userid : this.userId,
      adtype : this.adType,
      offset: 0,
      limit: 15
       /*type: '', // 'sell buy'
      country: '',
      coin: '',
      currency: '',
      payment: '',
      offset: 0,
      limit: 1000,
      userId: this.userId,
      status: this.status,*/
    };

    try {
      //console.log('my trade list');
      // this.list =  await this.cmService.listMyTradeList(_params);
      this.isLoading = true;
      const _result =  await this.cmService.listMyTradeList(_params);
      this.list = _result.list;
      this.total = _result.total;
      this.isLoading = false;
      console.log('my trade list', this.list);
      if (_result.total > this.list.length) {
        this.isShowLoadMore = true;
      } else {
        this.isShowLoadMore = false;
      }
    } catch (e) {
      this.isLoading = false;
      console.error(e);
    }

  }

  private async loadMoreTrade() {
    let currentListLength = 0;
      if (this.list) {
        currentListLength = this.list.length;
      }
    const _params = {
      userid : this.userId,
      adtype : this.adType,
      offset: currentListLength,
      limit: 1000
    };

    try {
      console.log('my trade list');
      this.isLoading = true;
      // this.list =  await this.cmService.listMyTradeList(_params);
      const _result =  await this.cmService.listMyTradeList(_params);
      console.log('my trade list', this.list);
      this.isLoading = false;

      if (this.list) {
        const tempList = this.list.concat(_result.list);
        this.list = tempList;
      } else {
        this.list = _result.list;
      }

      this.total = _result.total;

      if (_result.total > this.list.length) {
        this.isShowLoadMore = true;
      } else {
        this.isShowLoadMore = false;
      }

    } catch (e) {
      this.isLoading = false;
      console.error(e);
    }

  }


}
