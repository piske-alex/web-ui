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
  @Input()
  public actionType: string;

  //userId: string;

  i18ns: any = {};

  adId: string;
  adUserId: string;
  anotherUserId: string;
  adType: string;
  loginUserId: string;

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
    this.i18ns.do_rating = await this.languageService.get('my_trade.do_rating');
    this.i18ns.rating_1 = await this.languageService.get('my_trade.rating_1');
    this.i18ns.rating_0 = await this.languageService.get('my_trade.rating_0');
    this.i18ns.buy = await this.languageService.get('common.buy');
    this.i18ns.sale = await this.languageService.get('common.sale');
    this.i18ns.noPayed = await this.languageService.get('my_ad.order_status_buypay_status_0');
    this.i18ns.payed = await this.languageService.get('my_ad.order_status_buypay_status_1');
    this.i18ns.orderNo = await this.languageService.get('otc.orderNo');
    this.i18ns.orderCreateTime = await this.languageService.get('my_ad.order_create_time');
    this.i18ns.sellBtcTime = await this.languageService.get('otc.sellbtc_time');
    this.loginUserId = localStorage.getItem('user_id');
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

  //async toOrderDetail1(order: any) {
  //  this.router.navigate(['/orderDetail', { orderId: order.id, adId: order.adid, adUserId: this.adUserId, anotherUserId: order.userid }]);
  //}

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

  async doOrderRating (order: any, rating: string) {
    this.adService.updateOrderRating({ orderid: order.id, rating: rating }).then ( (_result) => {
      
      this.tradelist.forEach(item => {
        if(item.id == order.id){
          item.isRating = 1;
          if(rating == '1')
            item.orderRating = 1;
          else
            item.orderRating = 0;
        }
      });

    }, error => {
      console.log('doOrderRating error', error);
      console.log('doOrderRating error', error.message);
    });
  }



}
