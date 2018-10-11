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

  data: TransactionListItem = new TransactionListItem();
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
    // this.anotherUserId = localStorage.getItem('user_id');
    this.adUserId = localStorage.getItem('user_id');
    this.adId = this.route.snapshot.paramMap.get('adId');
    this.adType = this.route.snapshot.paramMap.get('adType');
    // this.adUserId = this.route.snapshot.paramMap.get('adUserId');

    this.i18ns.ap_alipay = await this.languageService.get('element_list_trans.ap_alipay');
    this.i18ns.wp_wechatpay = await this.languageService.get('element_list_trans.wp_wechatpay');
    this.i18ns.pp_paypal = await this.languageService.get('element_list_trans.pp_paypal');
    this.i18ns.bt_bank_transfer = await this.languageService.get('element_list_trans.bt_bank_transfer');

    try {
      // this.data = await this.adService.getOtcAdById({ adid: this.adId });
      // console.log('ad', this.data);
      // this.adUserId = this.data.userId;

      this.orders = await this.adService.getOrder({adid: this.adId});
      // this.orders = _result.data;
       console.log('adid orders', this.orders);
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

}
