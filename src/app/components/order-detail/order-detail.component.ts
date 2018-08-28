import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { AdService } from "../../providers/ad/ad.service";
import { LanguageService } from "../../providers/language/language.service";

@Component({
  selector: 'gz-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  delayDesc: string;
  orderId: string;
  order: any = {};

  i18ns: any = {};

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private languageService: LanguageService,
              private adService: AdService) {
  }

  async ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('orderId');

    this.i18ns.waitPay = await this.languageService.get('otc.waitPay');
    this.i18ns.minute = await this.languageService.get('otc.minute');
    this.i18ns.second = await this.languageService.get('otc.second');

    this.order = await this.adService.getOrder({orderid: this.orderId});

    setInterval(() => {
      this.getDelay();
    }, 1000);
  }

  goBack() {
    this.location.back();
  }

  getDelay() {
    let _overSecond = Date.now() / 1000 - this.order.create_time;
    let _maxSecond = 15 * 60;
    let _delaySecond = ((_maxSecond - _overSecond) % 60).toFixed(0);
    let _delayMin = ((_maxSecond - _overSecond) / 60).toFixed(0);
    if (+_delayMin > 0 && +_delaySecond >= 0) {
      this.delayDesc = `待付款 ${_delayMin}分 ${_delaySecond}秒`;
    } else if (+_delayMin == 0 && +_delaySecond > 0) {
      this.delayDesc = `待付款 ${_delayMin}分 ${_delaySecond}秒`;
    } else if (+_delayMin <= 0 && +_delaySecond <= 0) {
      this.delayDesc = `付款超时!`;
    }
  }

  async cancelOrder() {
    await this.adService.updateOrderStatus({orderid: this.orderId, action: 'cancel_submit'});
    this.location.back();
    this.location.back();
  }

  async payOrder() {
    await this.adService.updateOrderStatus({orderid: this.orderId, action: 'cancel_submit'});
    this.location.back();
    this.location.back();
  }

  async sellOrder() {
    await this.adService.updateOrderStatus({orderid: this.orderId, action: 'cancel_submit'});
    this.location.back();
    this.location.back();
  }
}
