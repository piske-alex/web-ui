import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdService } from '../../providers/ad/ad.service';
import { LanguageService } from '../../providers/language/language.service';
import { ListChatComponent } from '../element/list-chat/list-chat.component';


@Component({
  selector: 'app-order-detail-b',
  templateUrl: './order-detail-b.component.html',
  styleUrls: ['./order-detail-b.component.scss']
})
export class OrderDetailBComponent implements OnInit {
  delayDesc: string;
  orderId: string;
  order: any = {};
  i18ns: any = {};
  _ordertimer: any = 1;
  chatmsg: string;
  adId: string;
  adUserId: string;
  anotherUserId: string;
  isAdOwner: boolean;
  timeout: boolean;

  @ViewChild(ListChatComponent)
  private listChatComponent;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private languageService: LanguageService,
              private adService: AdService) {
  }

  async ngOnInit() {

    this.adId = this.route.snapshot.paramMap.get('adId');
    this.adUserId = this.route.snapshot.paramMap.get('adUserId');
    this.anotherUserId = this.route.snapshot.paramMap.get('anotherUserId');
    const currentLoginUserId = localStorage.getItem('user_id');
    if (currentLoginUserId === this.adUserId) {
      this.isAdOwner = true;
    } else {
      this.isAdOwner = false;
    }

    this.orderId = this.route.snapshot.paramMap.get('orderId');

    try {
      this.order = await this.adService.getOrder({orderid: this.orderId});
      console.log('this.order', this.order);
    } catch (e) {
      console.error(e);
    }

    this.i18ns.waitPay = await this.languageService.get('otc.waitPay');
    this.i18ns.minute = await this.languageService.get('otc.minute');
    this.i18ns.second = await this.languageService.get('otc.second');
    this.i18ns.pay_timeout = await this.languageService.get('otc.pay_timeout');

    this.timeout = true;

    let createTime : Date = new Date(this.order.create_time * 1000);
    let createTimePlap = createTime.getTime();
    createTime.setTime(createTimePlap + 1000 * 60 * 15);
    this.go(createTime);

    //document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight ;
  }

  goBack() {
    this.location.back();
  }

  leftTimer(enddate: Date) {
    let leftTime: number = ((new Date(enddate).getTime()) - new Date().getTime()); // 计算剩余的毫秒数
    let days: number = Math.floor(leftTime / 1000 / 60 / 60 / 24); // 计算剩余的天数
    let hours = Math.floor(leftTime / 1000 / 60 / 60 % 24); // 计算剩余的小时
    let minutes = Math.floor(leftTime / 1000 / 60 % 60); // 计算剩余的分钟
    let seconds = Math.floor(leftTime / 1000 % 60); // 计算剩余的秒数
    days = this.checkTime(days);
    hours = this.checkTime(hours);
    minutes = this.checkTime(minutes);
    seconds = this.checkTime(seconds);
    if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0) {
      this.delayDesc = this.i18ns.waitPay + ` ${minutes} ` + this.i18ns.minute + ` ${seconds} ` + this.i18ns.second;
      // console.log(days + "天" + hours + "小时" + minutes + "分" + seconds + "秒");
    } else {
      this.delayDesc = this.i18ns.pay_timeout;
    }
    if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
      this.delayDesc = this.i18ns.pay_timeout;
      window.clearInterval(this._ordertimer);
      this._ordertimer = null;
      this.timeout = false;

    }
 }
 checkTime(i) { // 将0-9的数字前面加上0，例1变为01
    if (i < 10) {
    i = "0" + i;
    }
    return i;
 }

  go(v) {
    let date1 = new Date(), data2 = v;
    if(data2<date1)return; // 设置的时间小于现在时间退出
    this._ordertimer = setInterval(()=>{this.leftTimer(data2)}, 1000);
  }

  async cancelOrder() {
    await this.adService.updateOrderStatus({orderid: this.orderId, action: 'cancel_submit'});
    this.location.back();
    this.location.back();
    // action
    // cancel_submit   payment_submit   seller_confirm  dispute_submit
    // force_confirm   force_cancel
  }

  async payOrder() {
    await this.adService.updateOrderStatus({orderid: this.orderId, action: 'payment_submit'});
    this.location.back();
    this.location.back();
  }

  async sellOrder() {
    await this.adService.updateOrderStatus({orderid: this.orderId, action: 'seller_confirm'});
    this.location.back();
    this.location.back();
  }

  async sendChatMsg() {
    console.log('chatmsg', this.chatmsg);
    if (!this.chatmsg) {
      //alert('请输入');
    } else {
      this.listChatComponent.send(this.chatmsg);
      document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
      document.querySelector('.div_list_chat').scrollTop = document.querySelector('.div_list_chat').scrollHeight + 100;

      this.chatmsg = '';
    }

  }
}
