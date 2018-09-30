import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TradeItem } from '../../models/common/TradeItem';
import { LanguageService } from '../../providers/language/language.service';
import { CommonService } from '../../providers/common/common.service';
import { Router } from '@angular/router';
//import { ListTradeComponent } from '../element/list-trade/list-trade.component';

@Component({
  selector: 'gz-my-trans',
  templateUrl: './my-trans.component.html',
  styleUrls: ['./my-trans.component.scss']
})
export class MyTransComponent implements OnInit {

  userId: string;
  status = 'active'; // old 1. 进行中， 10. 已下架   new status = (active=在架，hidden=下架)
  list: TradeItem[] = [];
  adType: string; //buy sell

  //@ViewChild(ListTradeComponent)
  //private listTradeComponent;

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
    
    this.adType = "buy";
    this.loadTrade();
  }

  goBack() {
    this.location.back();
  }

  selectProcessing() {
    this.status = 'active';
    this.adType = "buy";
    this.loadTrade();
  }

  selectObtained() {
    this.status = 'hidden';
    this.adType = "sell";
    this.loadTrade();
  }

  private async loadTrade() {
    const _params = {
      userid : this.userId,
      adtype : this.adType
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
      this.list =  await this.cmService.listMyTradeList(_params);
    } catch (e) {
      console.error(e);
    }

  }

}
