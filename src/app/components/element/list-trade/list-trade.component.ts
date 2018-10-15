import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { TradeItem } from '../../../models/common/TradeItem';
import { LanguageService } from '../../../providers/language/language.service';
import { AdService } from '../../../providers/ad/ad.service';
import { DialogService } from '../../../providers/dialog/dialog.service';

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

  adId: string;
  adUserId: string;
  anotherUserId: string;
  adType: string;

  constructor(private languageService: LanguageService,
    private router: Router,
    private route: ActivatedRoute,
    private adService: AdService,
    private dialogService: DialogService) {

  }

  async ngOnInit() {
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

  async toOrderDetail1(order: any) {
    this.router.navigate(['/orderDetail', { orderId: order.id, adId: order.adid, adUserId: this.adUserId, anotherUserId: order.userid }]);
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
