import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TradeItem } from '../../../models/common/TradeItem';
import { LanguageService } from '../../../providers/language/language.service';

@Component({
  selector: 'gz-list-trade',
  templateUrl: './list-trade.component.html',
  styleUrls: ['./list-trade.component.scss']
})
export class ListTradeComponent implements OnInit {

  @Input()
  public tradelist: TradeItem[];

  //adType: string;

  //userId: string;

  i18ns: any = {};

  constructor(private languageService: LanguageService, private router: Router) {
    //this.userId = localStorage.getItem('user_id');
  }

  async ngOnInit() {
    this.i18ns.currency = await this.languageService.get("otc.currency");
    this.i18ns.count = await this.languageService.get("otc.count");
    this.i18ns.price = await this.languageService.get("otc.price");
    this.i18ns.trade_time = await this.languageService.get("otc.trade_time");
    this.i18ns.collect_time = await this.languageService.get("otc.collect_time");
  }

  /*
  toTransaction(data: TradeItem) {
    this.router.navigate(['/transaction', { adId: data.adid || '' }]);
  }

  toAdOrders(data: TradeItem) {
    this.router.navigate(['/adOrders', { adId: data.adid || '' , adUserId: data.userid || ''}]);
  }
  */
  toUserDetail(adUserId: string) {
    this.router.navigate(['/user', { userId: adUserId, coinType: '' }]);
  }
  
}
