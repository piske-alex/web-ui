import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from "../../../providers/language/language.service";
import { OtcAd } from "../../../models/ad/OtcAd";
import { Router } from "@angular/router";
import { Deal } from "../../../models/ad/Deal";
import { TradeItem } from 'src/app/models/common/TradeItem';
import { DialogService } from '../../../providers/dialog/dialog.service';
import { AdService } from '../../../providers/ad/ad.service';

@Component({
  selector: 'gz-list-deal',
  templateUrl: './list-deal.component.html',
  styleUrls: ['./list-deal.component.scss']
})
export class ListDealComponent implements OnInit {

  @Input()
  list: TradeItem[];

  i18ns: any = {};

  constructor(private router: Router, private languageService: LanguageService,private adService: AdService,
    private dialogService: DialogService) {
  }

  async ngOnInit() {
    this.i18ns.bid = await this.languageService.get('common.bid');
    this.i18ns.limitAmount = await this.languageService.get('common.limitAmount');
    this.i18ns.buy = await this.languageService.get('common.buy');
    this.i18ns.sale = await this.languageService.get('common.sale');
    this.i18ns.dealPrice = await this.languageService.get('common.dealPrice');

    this.i18ns.currency = await this.languageService.get('otc.currency');
    this.i18ns.count = await this.languageService.get('otc.count');
    this.i18ns.price = await this.languageService.get('otc.price');
    this.i18ns.trade_time = await this.languageService.get('otc.trade_time');
    this.i18ns.collect_time = await this.languageService.get('otc.collect_time');
    this.i18ns.order_status = await this.languageService.get('my_ad.order_status');
    this.i18ns.order_status_unfinish = await this.languageService.get('my_ad.order_status_unfinish');
    this.i18ns.order_status_finish = await this.languageService.get('my_ad.order_status_finish');
    this.i18ns.order_status_canceled = await this.languageService.get('my_ad.order_status_canceled');
    this.i18ns.order_status_dispute = await this.languageService.get('my_ad.order_status_dispute');
    this.i18ns.order_detail = await this.languageService.get('my_ad.order_detail');
    this.i18ns.do_rating = await this.languageService.get('my_trade.do_rating');
    this.i18ns.rating_1 = await this.languageService.get('my_trade.rating_1');
    this.i18ns.rating_0 = await this.languageService.get('my_trade.rating_0');
    this.i18ns.noPayed = await this.languageService.get('my_ad.order_status_buypay_status_0');
    this.i18ns.payed = await this.languageService.get('my_ad.order_status_buypay_status_1');

  }

  toTransaction(data: OtcAd) {
    this.router.navigate(['/transaction', {adId: data.id || ''}])
  }

  async toOrderDetail2(order: any) {
    let data = await this.adService.getOtcAdById({ adid: order.adid }).then(item => {
          let adType = item.adType;
          if (adType == '2') {
            this.router.navigate(['/orderDetailB', { orderId: order.id,
              adId: order.adid, adUserId: item.userId, anotherUserId: order.userid }]);
          } else if (adType == '1') {
            this.router.navigate(['/orderDetail', { orderId: order.id,
              adId: order.adid, adUserId: item.userId, anotherUserId: order.userid }]);
          }
      }, err => {
        this.dialogService.alert(err);
      }
    );
  }


}
