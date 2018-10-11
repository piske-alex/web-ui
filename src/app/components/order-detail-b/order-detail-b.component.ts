import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdService } from '../../providers/ad/ad.service';
import { LanguageService } from '../../providers/language/language.service';
import { ListChatingComponent } from '../element/list-chating/list-chating.component';
import { DialogService } from '../../providers/dialog/dialog.service';


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

  isShowCancel: boolean;
  isShowBuyPay: boolean;
  isShowBuyDispute: boolean;
  isShowSellDispute: boolean;
  isShowSellConfirm: boolean;

  @ViewChild(ListChatingComponent)
  private listChatingComponent;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private languageService: LanguageService,
              private adService: AdService,
              private dialogService: DialogService) {
  }

  async ngOnInit() {

    this.adId = this.route.snapshot.paramMap.get('adId');
    this.adUserId = this.route.snapshot.paramMap.get('adUserId');
    this.anotherUserId = this.route.snapshot.paramMap.get('anotherUserId');
    const currentLoginUserId = localStorage.getItem('user_id');

    if (currentLoginUserId === this.adUserId) { // buyer
      this.isAdOwner = true;
      this.isShowBuyPay = true;
      this.isShowBuyDispute = true;
      this.isShowSellDispute = false;
      this.isShowSellConfirm = false;

    } else {
      this.isAdOwner = false;
      this.isShowBuyPay = false;
      this.isShowBuyDispute = false;
      this.isShowSellDispute = true;
      this.isShowSellConfirm = true;
    }

    this.orderId = this.route.snapshot.paramMap.get('orderId');

    try {
      this.order = await this.adService.getOrder({orderid: this.orderId});
      console.log('this.order', this.order);
      if (this.order.status == 'unfinish') { // unfinish, finish, canceled, dispute
        if (this.order.payment_status == '1') { // had paid
          if (!this.isAdOwner) { // sell
            this.isShowCancel = false;
            this.isShowBuyPay = false;
            this.isShowBuyDispute = false;
            this.isShowSellDispute = true;
            this.isShowSellConfirm = true;
          } else { // buy
            this.isShowCancel = false;
            this.isShowBuyPay = false;
            this.isShowBuyDispute = true;
            this.isShowSellDispute = false;
            this.isShowSellConfirm = false;
          }
        } else { // not paid
          if (!this.isAdOwner) { // sell
            this.isShowCancel = false;
            this.isShowBuyPay = false;
            this.isShowBuyDispute = false;
            this.isShowSellDispute = true;
            this.isShowSellConfirm = true;
          } else { // buy
            this.isShowCancel = true;
            this.isShowBuyPay = true;
            this.isShowBuyDispute = false;
            this.isShowSellDispute = false;
            this.isShowSellConfirm = false;
          }
        }
      } else { //  finish, canceled, dispute
        this.isShowCancel = false;
        this.isShowBuyPay = false;
        this.isShowBuyDispute = false;
        this.isShowSellDispute = false;
        this.isShowSellConfirm = false;
        this.stopInterval();
      }
    } catch (e) {
      console.error(e);
    }

    this.i18ns.waitPay = await this.languageService.get('otc.waitPay');
    this.i18ns.minute = await this.languageService.get('otc.minute');
    this.i18ns.second = await this.languageService.get('otc.second');
    this.i18ns.pay_timeout = await this.languageService.get('otc.pay_timeout');
    this.i18ns.confirm_markPay = await this.languageService.get('otc.confirm_markPay');
    this.i18ns.confirm_markReceive = await this.languageService.get('otc.confirm_markReceive');
    this.i18ns.confirm_markDispute = await this.languageService.get('otc.confirm_markDispute');
    this.i18ns.confirm_cancelTransaction = await this.languageService.get('otc.confirm_cancelTransaction');

    this.i18ns.order_status = await this.languageService.get('my_ad.order_status');
    this.i18ns.order_status_unfinish = await this.languageService.get('my_ad.order_status_unfinish');
    this.i18ns.order_status_finish = await this.languageService.get('my_ad.order_status_finish');
    this.i18ns.order_status_canceled = await this.languageService.get('my_ad.order_status_canceled');
    this.i18ns.order_status_dispute = await this.languageService.get('my_ad.order_status_dispute');

    this.isShowBuyDispute = false;
    this.timeout = true;

    let createTime: Date = new Date(this.order.create_time * 1000);
    let createTimePlap = createTime.getTime();
    createTime.setTime(createTimePlap + 1000 * 60 * 15);
    this.go(createTime);

    setTimeout(() => {
      document.querySelector('.div_list_chat').scrollTop = document.querySelector('.div_list_chat').scrollHeight + 150;
    }, 2000);
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
      this.isShowBuyPay = false;
    }
 }
 checkTime(i) { // 将0-9的数字前面加上0，例1变为01
    if (i < 10) {
    i = '0' + i;
    }
    return i;
 }

 stopInterval(){
    this.delayDesc = "";
    if(this._ordertimer != null){
      window.clearInterval(this._ordertimer);
      this._ordertimer = null;
    }
  }

  go(v) {
    let date1 = new Date(), data2 = v;
    if (data2 < date1) {
      return; // 设置的时间小于现在时间退出
    }
    this._ordertimer = setInterval(() => {this.leftTimer(data2)} , 1000);
  }

  async cancelOrder() {
    this.dialogService.confirm({ content: this.i18ns.confirm_cancelTransaction }).subscribe(async res => {
      if (res) {
        await this.adService.updateOrderStatus({orderid: this.orderId, action: 'cancel_submit'}).then(async (data) => {
          this.location.back();
          this.location.back();
        }, err => {
          this.dialogService.alert(err.error);
        });
      } else {
          return;
      }
    });
    // action
    // cancel_submit   payment_submit   seller_confirm  dispute_submit
    // force_confirm   force_cancel
  }

  async payOrder() {
    this.dialogService.confirm({ content: this.i18ns.confirm_markPay }).subscribe(async res => {
      if (res) {
        await this.adService.updateOrderStatus({orderid: this.orderId, action: 'payment_submit'}).then(async (data) => {
          this.isShowBuyDispute = true;
          this.isShowBuyPay = false;
          this.isShowCancel = false;
          this.stopInterval();
        }, err => {
          this.dialogService.alert(err.error);
        });
        // this.location.back();
        // this.location.back();
      } else {
          return;
      }
    });
  }

  async sellOrder() {
    this.dialogService.confirm({ content: this.i18ns.confirm_markReceive }).subscribe(async res => {
      if (res) {
        await this.adService.updateOrderStatus({orderid: this.orderId, action: 'seller_confirm'}).then(async (data) => {
          this.location.back();
          this.location.back();
        }, err => {
          this.dialogService.alert(err.error);
        });
      } else {
          return;
      }
    });
  }

  async sellMarkDispute() {
    this.dialogService.confirm({ content: this.i18ns.confirm_markDispute }).subscribe(async res => {
      if (res) {
        await this.adService.updateOrderStatus({orderid: this.orderId, action: 'dispute_submit'}).then(async (data) => {
          this.location.back();
          this.location.back();
        }, err => {
          this.dialogService.alert(err.error);
        });
      } else {
          return;
      }
    });
    // action
    // cancel_submit   payment_submit   seller_confirm  dispute_submit
    // force_confirm   force_cancel
  }

  async buyMarkDispute() {
    this.dialogService.confirm({ content: this.i18ns.confirm_markDispute }).subscribe(async res => {
      if (res) {
        await this.adService.updateOrderStatus({orderid: this.orderId, action: 'dispute_submit'}).then(async (data) => {
          this.location.back();
          this.location.back();
        }, err => {
          this.dialogService.alert(err.error);
        });
      } else {
          return;
      }
    });
    // action
    // cancel_submit   payment_submit   seller_confirm  dispute_submit
    // force_confirm   force_cancel
  }


  async sendChatMsg() {
    if (!this.chatmsg) {

    } else {
      this.listChatingComponent.send(this.chatmsg);
      document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
      // document.querySelector('.div_list_chat').scrollTop = document.querySelector('.div_list_chat').scrollHeight + 100;

      setTimeout(() => {
        document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
      }, 1000);
      this.chatmsg = '';
    }

  }
}
