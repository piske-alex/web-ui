import { Component, OnInit , ViewChild} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdService } from '../../providers/ad/ad.service';
import { TransactionListItem } from '../../models/ad/TransactionListItem';
import { LanguageService } from '../../providers/language/language.service';

@Component({
  selector: 'app-ad-orders',
  templateUrl: './ad-orders.component.html',
  styleUrls: ['./ad-orders.component.scss']
})
export class AdOrdersComponent implements OnInit {

  adData: TransactionListItem = new TransactionListItem();
  orders: any ;

  i18ns: any = {};
  userId: string;

  chatmsg: string;
  adId: string;
  adUserId: string;
  anotherUserId: string;

  adType: string;



  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private adService: AdService,
    private languageService: LanguageService) {
  }

  async ngOnInit() {
    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    // this.anotherUserId = localStorage.getItem('user_id');
    this.adUserId = localStorage.getItem('user_id');
    this.adId = this.route.snapshot.paramMap.get('adId');
    this.adType = this.route.snapshot.paramMap.get('adType');
    // this.adUserId = this.route.snapshot.paramMap.get('adUserId');

    this.i18ns.sale = await this.languageService.get('common.sale');
    this.i18ns.buy = await this.languageService.get('common.buy');
    this.i18ns.ad_orders_title = await this.languageService.get('my_ad.ad_orders_title');
    this.i18ns.order_id = await this.languageService.get('my_ad.order_id');
    this.i18ns.order_user_id = await this.languageService.get('my_ad.order_user_id');
    this.i18ns.order_status = await this.languageService.get('my_ad.order_status');
    this.i18ns.order_status_unfinish = await this.languageService.get('my_ad.order_status_unfinish');
    this.i18ns.order_status_finish = await this.languageService.get('my_ad.order_status_finish');
    this.i18ns.order_status_canceled = await this.languageService.get('my_ad.order_status_canceled');
    this.i18ns.order_status_dispute = await this.languageService.get('my_ad.order_status_dispute');

    this.i18ns.order_amount = await this.languageService.get('my_ad.order_amount');
    this.i18ns.order_create_time = await this.languageService.get('my_ad.order_create_time');
    this.i18ns.order_detail = await this.languageService.get('my_ad.order_detail');
    this.i18ns.has_no_order = await this.languageService.get('my_ad.has_no_order');

    this.i18ns.ap_alipay = await this.languageService.get('element_list_trans.ap_alipay');
    this.i18ns.wp_wechatpay = await this.languageService.get('element_list_trans.wp_wechatpay');
    this.i18ns.pp_paypal = await this.languageService.get('element_list_trans.pp_paypal');
    this.i18ns.bt_bank_transfer = await this.languageService.get('element_list_trans.bt_bank_transfer');
    this.i18ns.noPayed = await this.languageService.get('my_ad.order_status_buypay_status_0');
    this.i18ns.payed = await this.languageService.get('my_ad.order_status_buypay_status_1');
    
    this.i18ns.do_rating = await this.languageService.get('my_trade.do_rating');
    this.i18ns.rating_1 = await this.languageService.get('my_trade.rating_1');
    this.i18ns.rating_0 = await this.languageService.get('my_trade.rating_0');

    try {
       this.adData = await this.adService.getOtcAdById({ adid: this.adId });
       console.log('ad', this.adData);
      // this.adUserId = this.data.userId;

      await this.adService.getOrder({adid: this.adId}).then( (data) => {
        // this.orders = data;
        this.orders = data.sort((obj1, obj2) => {
          if (obj1.create_time > obj2.create_time) {
              return -1;
          }
          if (obj1.create_time < obj2.create_time) {
              return 1;
          }
          return 0;
        });
        // console.log('adid orders1', this.orders);
      } , error => {
        console.log('adid orders2', error);
      });
      // this.orders = _result.data;
     // const loginUserId = localStorage.getItem('user_id');
     // this.orders = await this.adService.getOrder({userid: loginUserId});
     // console.log('loginUserId orders', this.orders);

    } catch (e) {
      console.error(e);
    }

  }

  goBack() {
    this.location.back();
  }

  toOrderDetail1(order: any) {
      this.router.navigate(['/orderDetail', { orderId: order.id, adId: this.adId, adUserId: this.adUserId, anotherUserId: order.userid }]);
  }

  toOrderDetail2(order: any) {
    this.router.navigate(['/orderDetailB', { orderId: order.id, adId: this.adId, adUserId: this.adUserId, anotherUserId: order.userid }]);
  }

  async doOrderRating (order: any, rating: string) {
    this.adService.updateOrderRating({ orderid: order.id, rating: rating }).then ( (_result) => {

      this.adService.getOrder({adid: this.adId}).then( (data) => {
        this.orders = data;
        // console.log('adid orders1', this.orders);
      } , error => {
        // console.log('adid orders2', error);
      });

    }, error => {
      console.log('doOrderRating error', error);
      console.log('doOrderRating error', error.message);
    });
  }

}
