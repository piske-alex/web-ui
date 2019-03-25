import { Component, OnInit, ViewChild ,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdService } from '../../providers/ad/ad.service';
import { LanguageService } from '../../providers/language/language.service';
import { ListChatingComponent } from '../element/list-chating/list-chating.component';
import { DialogService } from '../../providers/dialog/dialog.service';
import { CommonService } from 'src/app/providers/common/common.service';


@Component({
  selector: 'app-order-detail-b',
  templateUrl: './order-detail-b.component.html',
  styleUrls: ['./order-detail-b.component.scss']
})
export class OrderDetailBComponent implements OnInit {
  delayDesc: string;
  delayDesc2:string;
  orderId: string;
  order: any = {};
  i18ns: any = {};
  _ordertimer: any = 1;
  _ordertimer2: any = null;
  chatmsg: string;
  adId: string;
  adUserId: string;
  anotherUserId: string;
  isAdOwner: boolean;
  timeout: boolean;
  isStop: boolean;
  isStopByPaymentDelay: boolean;
  payStatus: string;

  btccnt: string;
  initNewStatus: any;

  isShowCancel: boolean;
  isShowBuyPay: boolean;
  isShowBuyDispute: boolean;
  isShowSellDispute: boolean;
  isShowSellConfirm: boolean;
  isShowPassword: boolean;
  isShowHadPaidNeedConfirm: boolean;
  isHiddenByTimeout:boolean;

  isTmpHide:boolean;

  paypassword: string;
  isShowPayPassword: boolean;

  isFirst: boolean;
  distantTime: number;
  
  userId: string;

  @ViewChild(ListChatingComponent)
  private listChatingComponent;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private languageService: LanguageService,
              private commonService: CommonService,
              private adService: AdService,
              private dialogService: DialogService) {
  }

  async ngOnDestroy(){
    if(this.initNewStatus !== undefined)
      clearInterval(this.initNewStatus);
  }

  async ngOnInit() {

    this.userId = localStorage.getItem('user_id');
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.adId = this.route.snapshot.paramMap.get('adId');
    this.adUserId = this.route.snapshot.paramMap.get('adUserId');
    this.anotherUserId = this.route.snapshot.paramMap.get('anotherUserId');
    const currentLoginUserId = localStorage.getItem('user_id');
    this.isStop = false;
    this.isShowPayPassword = false;
    this.isStopByPaymentDelay = true;
    this.isHiddenByTimeout = false;
    
    this.isTmpHide = false;

    if (currentLoginUserId === this.adUserId) { // buyer
      this.isAdOwner = true;
      this.isShowBuyPay = true;
      this.isShowBuyDispute = true;
      this.isShowSellDispute = false;
      this.isShowSellConfirm = false;
      this.isShowHadPaidNeedConfirm = false;

    } else {
      this.isAdOwner = false;
      this.isShowBuyPay = false;
      this.isShowBuyDispute = false;
      this.isShowSellDispute = true;
      this.isShowSellConfirm = true;
      this.isShowHadPaidNeedConfirm = false;
    }

    this.orderId = this.route.snapshot.paramMap.get('orderId');
    let noPayed = await this.languageService.get('my_ad.order_status_buypay_status_0');
    let payed = await this.languageService.get('my_ad.order_status_buypay_status_1');

    this.i18ns.userid_neither_ad_nor_order = await this.languageService.get('my_ad.userid_neither_ad_nor_order');
    let delayConfirm:number = 2;
    await this.commonService.getSettingInfo({key:"merchant_order_no_confirm_payment_timeout_seconds"}).then(d=>{
      if(!isNaN(d))
      delayConfirm = parseInt(d)/60;
    }, error=>{});

    
    this.isFirst = true;

    try {

      let getNewStatusFn = async () =>{
          this.order = await this.adService.getOrder({orderid: this.orderId});
          if(this.isFirst){
            this.isFirst = false;
            let now = new Date().getTime(); 
            let serNowTime = this.order.serverTime * 1000; 
            this.distantTime = now - serNowTime; //本地时间与服务器时间差值
            //console.log(serNowTime,this.distantTime);
          }

          // console.log('this.order', this.order);
          this.payStatus = this.order.payment_status === 0 ? noPayed : payed ;

          if (this.order.status == 'unfinish') { // unfinish, finish, canceled, dispute
            if (this.order.payment_status == '1') { // had paid
              // if(this.initNewStatus !== undefined)
              //     clearInterval(this.initNewStatus);
              this.stopInterval();
              this.isStop = true;
              if (!this.isAdOwner) { // sell
                this.isShowCancel = false;
                this.isShowBuyPay = false;
                this.isShowBuyDispute = false;
                this.isShowSellDispute = true;
                this.isShowSellConfirm = true;
                if (this.order.ad_data.is_merchant == 1) {
                  this.isShowHadPaidNeedConfirm = true;
                  this.isStopByPaymentDelay = false;
                  if (this._ordertimer2 == null) {
                    this.startIntervalByPaidDelay(this.order.payment_time, delayConfirm);
                  }
                }
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
            this.isShowHadPaidNeedConfirm = false;
            if(this.initNewStatus !== undefined && this.order.status != "dispute")
                clearInterval(this.initNewStatus);
            this.stopInterval();
            this.stopInterval2();
            this.isStop = true;
            this.isStopByPaymentDelay = true;
          }
    }

    await getNewStatusFn();
    this.initNewStatus = setInterval(getNewStatusFn,5000);

    } catch (e) {
      if (e.error == 'userid_neither_ad_nor_order') {
        this.dialogService.alert(this.i18ns.userid_neither_ad_nor_order).subscribe(
          res => {
            this.router.navigate(['/otc']);
            return;
          }
        );
      } else {
        console.error('load order error ', e);
      }
    }

    this.i18ns.waitcollection = await this.languageService.get('otc.waitcollection');

    this.i18ns.waitPay = await this.languageService.get('otc.waitPay');
    this.i18ns.minute = await this.languageService.get('otc.minute');
    this.i18ns.second = await this.languageService.get('otc.second');
    this.i18ns.pay_timeout = await this.languageService.get('otc.pay_timeout');
    this.i18ns.confirm_markPay = await this.languageService.get('otc.confirm_markPay');
    this.i18ns.confirm_markReceive = await this.languageService.get('otc.confirm_markReceive');
    this.i18ns.confirm_markDispute = await this.languageService.get('otc.confirm_markDispute');
    this.i18ns.confirm_cancelTransaction = await this.languageService.get('otc.confirm_cancelTransaction');

    this.i18ns.mark_dispute_err_notpaid = await this.languageService.get('otc.mark_dispute_err_notpaid');
    this.i18ns.mark_receive_err_notpaid = await this.languageService.get('otc.mark_receive_err_notpaid');
    this.i18ns.paypassword_invalid = await this.languageService.get('otc.paypassword_invalid');
    this.i18ns.paypassword_notfound = await this.languageService.get('otc.paypassword_notfound');

    this.i18ns.err_PasswordNotActive = await this.languageService.get('otc.err_PasswordNotActive');
    this.i18ns.mark_dispute_success = await this.languageService.get('otc.mark_dispute_success');
    this.i18ns.submit_fail = await this.languageService.get('user_real_cert.submit_fail');

    this.i18ns.mark_receive_success = await this.languageService.get('otc.mark_receive_success');
    this.i18ns.order_must_be_unfinish = await this.languageService.get('otc.order_must_be_unfinish');
    this.i18ns.order_has_been_confirm = await this.languageService.get('otc.order_has_been_confirm');
    this.i18ns.order_already_mark_dispute = await this.languageService.get('otc.order_already_mark_dispute');
    this.i18ns.order_already_mark_finish = await this.languageService.get('otc.order_already_mark_finish');

    this.i18ns.order_status = await this.languageService.get('my_ad.order_status');
    this.i18ns.order_status_unfinish = await this.languageService.get('my_ad.order_status_unfinish');
    this.i18ns.order_status_finish = await this.languageService.get('my_ad.order_status_finish');
    this.i18ns.order_status_canceled = await this.languageService.get('my_ad.order_status_canceled');
    this.i18ns.order_status_dispute = await this.languageService.get('my_ad.order_status_dispute');

    this.i18ns.input_trans_password = await this.languageService.get('user_trans_password.input_trans_password');
    this.i18ns.cancel = await this.languageService.get('common.cancel');
    this.i18ns.confirm = await this.languageService.get('common.confirm');
    this.i18ns.modify_by_other = await this.languageService.get('otc.modify_by_other');
    this.isShowBuyDispute = false;

    this.btccnt = this.order.coin_amount ; //  (this.order.amount / this.order.ad_data.legal_currency_rate).toFixed(8) ;

    this.timeout = true;

    let createTime: Date = new Date(this.order.create_time * 1000);
    let createTimePlap = createTime.getTime();

    let delayTime: number = 15;
    let delayTimeSettings: number = 900;
    if (this.order.ad_data.is_merchant == 1) {
      await this.commonService.getSettingInfo({key: 'merchant_order_no_payment_timeout_seconds'}).then( d => {
        if (!isNaN(d)) {
          delayTimeSettings = parseInt(d);
          delayTime = parseInt(d) / 60;
        }
      }, error => {});
    } else {
      await this.commonService.getSettingInfo({key: 'order_auto_cancel_time'}).then( d => {
        if (!isNaN(d)) {
          delayTimeSettings = parseInt(d);
          delayTime = parseInt(d) / 60;
        }
      }, error => {});
    }
    const delay: number =  delayTime ;
    this.i18ns.orderDelay15Min = await this.languageService.get('otc.orderDelay15Min');
    this.i18ns.orderDelay15Min = this.i18ns.orderDelay15Min.replace('${delay}', delay);

    this.i18ns.merchant_msg_1 = await this.languageService.get('otc.merchant_msg_1');
    this.i18ns.merchant_msg_3 = await this.languageService.get('otc.merchant_msg_3');
    this.i18ns.orderHadPaidNeedConfirmIn2Min = await this.languageService.get('otc.orderHadPaidNeedConfirmIn2Min');
    this.i18ns.orderHadPaidNeedConfirmIn2Min = this.i18ns.orderHadPaidNeedConfirmIn2Min.replace('{delay}', delayConfirm);
    this.i18ns.merchant_msg_2 = await this.languageService.get('otc.merchant_msg_2');
    this.i18ns.merchant_msg_2 = this.i18ns.merchant_msg_2.replace('{delay}', delayConfirm);

    if (this.order.status == 'unfinish' && this.order.payment_status == '1' && !this.isAdOwner && this.order.ad_data.is_merchant == 1) {
      //let paymentTime: Date = new Date(this.order.payment_time * 1000);
      //let paymentTimePlap = paymentTime.getTime();
      //paymentTime.setTime(paymentTimePlap + 1000 * 60 * delayConfirm);
      //this.go2(paymentTime);
      this.startIntervalByPaidDelay(this.order.payment_time, delayConfirm);
    } else {
      createTime.setTime(createTimePlap + 1000 * delayTimeSettings + this.distantTime);
      this.go(createTime);
    }

    setTimeout(() => {
      if (document.querySelector('.div_list_chat')) {
        document.querySelector('.div_list_chat').scrollTop = document.querySelector('.div_list_chat').scrollHeight + 150;
      }
    }, 1500);
  }

  startIntervalByPaidDelay(payment_time, delayConfirm) {
      let paymentTime: Date = new Date(payment_time * 1000);
      let paymentTimePlap = paymentTime.getTime();
      paymentTime.setTime(paymentTimePlap + 1000 * 60 * delayConfirm);
      this.go2(paymentTime);
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

 leftTimer2(enddate: Date) {
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
    this.delayDesc2 = this.i18ns.waitcollection + ` ${minutes} ` + this.i18ns.minute + ` ${seconds} ` + this.i18ns.second;
    // console.log(days + "天" + hours + "小时" + minutes + "分" + seconds + "秒");
  } else {
    this.delayDesc2 = "";//this.i18ns.pay_timeout;
  }
  if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
    this.delayDesc2 = "";//this.i18ns.pay_timeout;
    window.clearInterval(this._ordertimer2);
    this._ordertimer2 = null;
    this.timeout = false;
    this.isShowBuyPay = false;
    
    this.isHiddenByTimeout = true;
  }
}

 checkTime(i) { // 将0-9的数字前面加上0，例1变为01
    if (i < 10) {
    i = '0' + i;
    }
    return i;
 }

 stopInterval() {
    this.isStop = true;
    this.delayDesc = '';
    if (this._ordertimer != null) {
      window.clearInterval(this._ordertimer);
      this._ordertimer = null;
    }
  }
  stopInterval2() {
    this.isStopByPaymentDelay = true;
    this.delayDesc2 = '';
    if (this._ordertimer2 != null) {
      window.clearInterval(this._ordertimer2);
      this._ordertimer2 = null;
    }
  }

  go(v) {
    let date1 = new Date(), data2 = v;
    if (data2 < date1) {
      return; // 设置的时间小于现在时间退出
    }
    if(this.isStop == true)
      return;
    this._ordertimer = setInterval(() => {this.leftTimer(data2)} , 1000);
  }

  go2(v) {
    let date1 = new Date(), data2 = v;
    if (data2 < date1) {
      return; // 设置的时间小于现在时间退出
    }
    if(this.isStopByPaymentDelay == true)
      return;
    this._ordertimer2 = setInterval(() => {this.leftTimer2(data2)} , 1000);
  }

  async cancelOrder(event) {
    this.dialogService.confirm({ content: this.i18ns.confirm_cancelTransaction }).subscribe(async res => {
      if (res) {
        await this.adService.updateOrderStatus({orderid: this.orderId, action: 'cancel_submit', "updateTime" : this.order.update_time}).then(async (data) => {
          event.next(2);
          this.location.back();
          this.location.back();
        }, err => {
          event.next(2);
          if (err.error == 'modify_by_other') {
            this.dialogService.alert(this.i18ns.modify_by_other);
            this.ngOnInit();
          } else {
            let error = (err.error && err.error != "") ? err.error : this.i18ns.submit_fail;
            this.dialogService.alert(error);
          }
        });
      } else {
          event.next(2);
          return;
      }
    });
    // action
    // cancel_submit   payment_submit   seller_confirm  dispute_submit
    // force_confirm   force_cancel
  }

  async payOrder(event) {
    this.dialogService.confirm({ content: this.i18ns.confirm_markPay }).subscribe(async res => {
      if (res) {
        await this.adService.updateOrderStatus({orderid: this.orderId, action: 'payment_submit', "updateTime" : this.order.update_time}).then(async (data) => {
          this.isShowBuyDispute = true;
          this.isShowBuyPay = false;
          this.isShowCancel = false;
          this.stopInterval();
          this.payStatus = await this.languageService.get('my_ad.order_status_buypay_status_1') ;
          event.next(2);
        }, err => {
          event.next(2);
          if (err.error == 'modify_by_other') {
            this.dialogService.alert(this.i18ns.modify_by_other);
            this.ngOnInit();
          } else {
            let error = (err.error && err.error != "") ? err.error : this.i18ns.submit_fail;
            this.dialogService.alert(error);
          }
        });
        // this.location.back();
        // this.location.back();
      } else {
          event.next(2);
          return;
      }
    });
  }

  // async sellOrder() {
  //   this.dialogService.confirm({ content: this.i18ns.confirm_markReceive }).subscribe(async res => {
  //     if (res) {
  //       await this.adService.updateOrderStatus({orderid: this.orderId, action: 'seller_confirm'}).then(async (data) => {
  //         this.location.back();
  //         this.location.back();
  //       }, err => {
  //         this.dialogService.alert(err.error);
  //       });
  //     } else {
  //         return;
  //     }
  //   });
  // }

  async sellOrder() {
    this.dialogService.confirm({ content: this.i18ns.confirm_markReceive }).subscribe(async res => {
      if (res) {
        this.isShowPayPassword = true;
      } else {
        this.isShowPayPassword = false;
      }
    });
  }

  cancelSellerConfirm() {
    this.isShowPayPassword = false;
  }

  confirmSellerConfirm() {
    if (!this.paypassword) {
      return this.dialogService.alert(this.i18ns.input_trans_password);
    }

    this.isShowPayPassword = false;
    this.isTmpHide = true;
    try {
      this.adService.updateOrderStatus({orderid: this.orderId,
        action: 'seller_confirm', paypassword: this.paypassword, "updateTime" : this.order.update_time}).then(async (data) => {
          this.dialogService.alert(this.i18ns.mark_receive_success).subscribe(
            res => {
              this.isTmpHide = false;
              //已经完成，跳转到钱包
              //if (this.order.status == 'finish'){
                this.router.navigate(['/wallet']);
                //return;
              //}
              //this.location.back();
              //this.location.back();
            }
          );
        }, err => {
          console.log('err-sellerconfirm1', err);
          this.isTmpHide = false;
          if (err.error) {
            if (err.error == 'order payment has not been confirmed') {
              this.dialogService.alert(this.i18ns.mark_receive_err_notpaid);
            } else {
              // order payment has been confirm
              if (err.error.name == 'NotFoundError') {
                this.dialogService.alert(this.i18ns.paypassword_notfound);
              } else if (err.error.name == 'PasswordInvalid') {
                this.dialogService.alert(this.i18ns.paypassword_invalid);
              } else if (err.error.name == 'PasswordNotActive') {
                let passwordNotActive = this.i18ns.err_PasswordNotActive;
                const activetime  = err.error.active.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                passwordNotActive = passwordNotActive.replace('{0}', activetime);
                this.dialogService.alert(passwordNotActive);
              } else if (err.error == 'the order status must be unfinish') {
                this.dialogService.alert(this.i18ns.order_must_be_unfinish);
                this.ngOnInit();
              } else if (err.error == 'order has been confirm') {
                this.dialogService.alert(this.i18ns.order_has_been_confirm);
                this.ngOnInit();
              } else if (err.error == 'order_already_mark_dispute') {
                this.dialogService.alert(this.i18ns.order_already_mark_dispute);
                this.ngOnInit();
              } else if (err.error == 'order_already_mark_finish') {
                this.dialogService.alert(this.i18ns.order_already_mark_finish);
                this.ngOnInit();
              } else if (err.error == 'modify_by_other') {
                this.dialogService.alert(this.i18ns.modify_by_other);
                this.ngOnInit();
              }   else {
                if (err.error.message) {
                  this.dialogService.alert(err.error.message);
                } else if (err.error) {
                  let error = err.error && err.error != "" ? err.error: this.i18ns.submit_fail;
                  this.dialogService.alert(error);
                }
              }
            }
          }
        });
    } catch (e) {
      console.log('err-sellerconfirm', e);
      this.dialogService.alert(e.message);
      this.isTmpHide = false;
    }
  }

  async sellMarkDispute(event) {
    this.dialogService.confirm({ content: this.i18ns.confirm_markDispute }).subscribe(async res => {
      if (res) {
        await this.adService.updateOrderStatus({orderid: this.orderId, action: 'dispute_submit', "updateTime" : this.order.update_time}).then(async (data) => {
          this.dialogService.alert(this.i18ns.mark_dispute_success).subscribe(
            res2 => {
              event.next(2);
              //this.location.back();
              //this.location.back();
            }
          );
        }, err => {
          if (err.error) {
            if (err.error == 'buyer_not_paid') {
              this.dialogService.alert(this.i18ns.mark_dispute_err_notpaid);
            } else if (err.error == 'the order status must be unfinish') {
              this.dialogService.alert(this.i18ns.order_must_be_unfinish);
            } else if (err.error == 'order_already_mark_dispute') {
              this.dialogService.alert(this.i18ns.order_already_mark_dispute);
              this.ngOnInit();
            } else if (err.error == 'order_already_mark_finish') {
              this.dialogService.alert(this.i18ns.order_already_mark_finish);
              this.ngOnInit();
            } else if (err.error == 'modify_by_other') {
              this.dialogService.alert(this.i18ns.modify_by_other);
              this.ngOnInit();
            }  else {
              let error = err.error && err.error != "" ? err.error: this.i18ns.submit_fail;
              this.dialogService.alert(error);
            }
          }
          event.next(2);
        });
      } else {
          event.next(2);
          return;
      }
    });
    // action
    // cancel_submit   payment_submit   seller_confirm  dispute_submit
    // force_confirm   force_cancel
  }

  async buyMarkDispute(event) {
    this.dialogService.confirm({ content: this.i18ns.confirm_markDispute }).subscribe(async res => {
      if (res) {
        await this.adService.updateOrderStatus({orderid: this.orderId, action: 'dispute_submit', "updateTime" : this.order.update_time}).then(async (data) => {
          this.dialogService.alert(this.i18ns.mark_dispute_success).subscribe(
            res2 => {
              event.next(2);
              //this.location.back();
              //this.location.back();
            }
          );
        }, err => {
          if (err.error == 'the order status must be unfinish') {
            this.dialogService.alert(this.i18ns.order_must_be_unfinish);
          } else if (err.error == 'order_already_mark_dispute') {
            this.dialogService.alert(this.i18ns.order_already_mark_dispute);
            this.ngOnInit();
          } else if (err.error == 'order_already_mark_finish') {
            this.dialogService.alert(this.i18ns.order_already_mark_finish);
            this.ngOnInit();
          } else if (err.error == 'modify_by_other') {
            this.dialogService.alert(this.i18ns.modify_by_other);
            this.ngOnInit();
          }  else {
            let error = err.error && err.error != "" ? err.error: this.i18ns.submit_fail;
            this.dialogService.alert(error);
          }
          event.next(2);
        });
      } else {
          event.next(2);
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
      if (document.querySelector('.div_list_chat')) {
        document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
        // document.querySelector('.div_list_chat').scrollTop = document.querySelector('.div_list_chat').scrollHeight + 100;

        setTimeout(() => {
          document.querySelector('.div_list_chat').scrollTop = document.querySelector('.gz-chat-list').scrollHeight + 150;
        }, 1000);
      }
      this.chatmsg = '';
    }

  }

  showPassword(show: boolean) {
    this.isShowPassword = show;
  }
}
