import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdService } from '../../providers/ad/ad.service';
import { TransactionListItem } from '../../models/ad/TransactionListItem';
import { LanguageService } from '../../providers/language/language.service';
import { DialogService } from '../../providers/dialog/dialog.service';
import { CommonService } from 'src/app/providers/common/common.service';

@Component({
  selector: 'app-transaction-b',
  templateUrl: './transaction-b.component.html',
  styleUrls: ['./transaction-b.component.scss']
})
export class TransactionBComponent implements OnInit {

  data: TransactionListItem = new TransactionListItem();

  i18ns: any = {};
  payAmount: any;
  receiveAmount: any;
  isShowConfirm: boolean;

  userId: string;
  adId: string;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private adService: AdService,
    private languageService: LanguageService,
    private commonService: CommonService,
    private dialogService: DialogService) {
  }

  async ngOnInit() {
    this.userId = localStorage.getItem('user_id');
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }
    this.adId = this.route.snapshot.paramMap.get('adId');

    this.i18ns.contact = await this.languageService.get('common.contact');
    this.i18ns.buy = await this.languageService.get('common.buy');
    this.i18ns.confirm = await this.languageService.get('common.confirm');
    this.i18ns.sale = await this.languageService.get('common.sale');
    this.i18ns.help = await this.languageService.get('common.help');
    this.i18ns.wantBuy = await this.languageService.get('otc.wantBuy');
    this.i18ns.wantSale = await this.languageService.get('otc.wantSale');
    this.i18ns.saleWarn_1 = await this.languageService.get('otc.saleWarn_1');
    this.i18ns.saleWarn_2 = await this.languageService.get('otc.saleWarn_2');
    this.i18ns.saleWarn_3 = await this.languageService.get('otc.saleWarn_3');
    this.i18ns.saleWarn_4 = await this.languageService.get('otc.saleWarn_4');
    this.i18ns.adRemark = await this.languageService.get('otc.adRemark');
    this.i18ns.transactionLimit = await this.languageService.get('otc.transactionLimit');
    this.i18ns.transactionLimit = await this.languageService.get('otc.transactionLimit');
    this.i18ns.onlyRealUser = await this.languageService.get('otc.onlyRealUser');

    this.i18ns.input_x_amount = await this.languageService.get('transaction.input_x_amount');
    this.i18ns.min_x_amount = await this.languageService.get('transaction.min_x_amount');
    this.i18ns.max_x_amount = await this.languageService.get('transaction.max_x_amount');
    this.i18ns.input_x_number = await this.languageService.get('transaction.input_x_number');
    this.i18ns.confirm_obtained = await this.languageService.get('transaction.confirm_obtained');

    this.i18ns.minAmt = await this.languageService.get('transaction.minAmt');
    this.i18ns.maxAmt = await this.languageService.get('transaction.maxAmt');

    this.i18ns.confirm_sell = await this.languageService.get('transaction.confirm_sell');
    this.i18ns.confirm_buy = await this.languageService.get('transaction.confirm_buy');
    this.i18ns.cancel_sell = await this.languageService.get('transaction.cancel_sell');
    this.i18ns.cancel_buy = await this.languageService.get('transaction.cancel_buy');
    this.i18ns.goto_old_unfinish_order = await this.languageService.get('transaction.goto_old_unfinish_order');
    this.i18ns.buy_sell_has_dispute_order = await this.languageService.get('transaction.buy_sell_has_dispute_order');
    this.i18ns.reach_maximun_unflnish_order = await this.languageService.get('transaction.reach_maximun_unflnish_order');


    this.i18ns.ap_alipay = await this.languageService.get('element_list_trans.ap_alipay');
    this.i18ns.wp_wechatpay = await this.languageService.get('element_list_trans.wp_wechatpay');
    this.i18ns.pp_paypal = await this.languageService.get('element_list_trans.pp_paypal');
    this.i18ns.bt_bank_transfer = await this.languageService.get('element_list_trans.bt_bank_transfer');
    this.i18ns.insufficient_balance = await this.languageService.get('otc.insufficient_balance');
    this.i18ns.err_adv_seller_insufficient_balance = await this.languageService.get('otc.err_adv_seller_insufficient_balance');
    this.i18ns.err_seller_insufficient_balance = await this.languageService.get('otc.err_seller_insufficient_balance');
    this.i18ns.not_trans_as_ad_hidden = await this.languageService.get('otc.not_trans_as_ad_hidden');
    this.i18ns.err_seller_collection_info_not_complete = await this.languageService.get('otc.seller_collection_info_not_complete');
    this.i18ns.err_seller_collection_info_not_ap = await this.languageService.get('otc.seller_collection_info_not_ap');
    this.i18ns.err_seller_collection_info_not_wp = await this.languageService.get('otc.seller_collection_info_not_wp');
    this.i18ns.err_seller_collection_info_not_bt = await this.languageService.get('otc.seller_collection_info_not_bt');
    this.i18ns.saleWarn_merchant_1 = await this.languageService.get('otc.saleWarn_merchant_1');
    let delayConfirm:number = 2;
    await this.commonService.getSettingInfo({key:"merchant_order_no_confirm_payment_timeout_seconds"}).then( d => {
      if(!isNaN(d))
      delayConfirm = parseFloat(d)/60;
    }, error => {});
    this.i18ns.saleWarn_merchant_2 = await this.languageService.get('otc.saleWarn_merchant_2');
    this.i18ns.saleWarn_merchant_2 = this.i18ns.saleWarn_merchant_2.replace('{1}', delayConfirm);


    try {
      this.data = await this.adService.getOtcAdById({ adid: this.adId });
      if (this.data.limitMinAmount == this.data.limitMaxAmount) {
        this.receiveAmount = this.data.limitMinAmount;
        this.payAmount = +((this.receiveAmount / +this.data.rate).toFixed(8));
      }
    } catch (e) {
      console.error(e);
      if (e.error === 'advertisement not found') {
        this.dialogService.alert(this.i18ns.not_trans_as_ad_hidden);
      }
    }

  }


  goBack() {
    this.location.back();
  }

  goToHelp() {
    this.router.navigate(['/help', { type: 'sell' }]);
  }

  goToChat() {
    this.router.navigate(['/chat', { adId: this.adId,
      adUserId: this.data.userId, anotherUserId: this.userId
    }]);
  }

  getRemark() {
    return this.i18ns.adRemark + ': ' + (this.data.remark || '');
  }

  getLeftTopTxt() {
    return this.i18ns.transactionLimit + ' ' + this.transform(this.data.limitMinAmount)
    + '~' + this.transform(this.data.limitMaxAmount) + ' ' + this.data.transactionCurrency;
  }

  getRightTopTxt() {
    return this.transform(this.data.rate) + ' ' + this.data.transactionCurrency;
  }

  async transaction() {
    // if (this.data.adType === '1') {
      let _payDes = this.i18ns.sale;
      if (!this.payAmount) {
        let inputAmount = this.i18ns.input_x_number ;
        inputAmount = inputAmount.replace('{BuyOrSell}', _payDes);
        this.dialogService.alert(inputAmount);
      } else if (this.receiveAmount < Number(this.data.limitMinAmount)) {
        let minAmount = this.i18ns.minAmt ;
        minAmount = minAmount.replace('{BuyOrSell}', _payDes);
        minAmount = minAmount.replace('{Amount}', this.data.limitMinAmount);
        this.dialogService.alert(minAmount );
      } else if (this.receiveAmount > Number(this.data.limitMaxAmount)) {
        let maxAmount = this.i18ns.maxAmt ;
        maxAmount = maxAmount.replace('{BuyOrSell}', _payDes);
        maxAmount = maxAmount.replace('{Amount}', this.data.limitMaxAmount);
        this.dialogService.alert(maxAmount);
      } else {
        this.isShowConfirm = true;
      }

      // this.payAmount = Number(this.payAmount.toFixed(2));
      // this.receiveAmount = Number(this.receiveAmount.toFixed(8));
    // }
  }

  cancelTransaction() {
    this.isShowConfirm = false;
  }

  confirmTransaction() {
    this.isShowConfirm = false;

    // const _result = await this.adService.transaction({ adid: this.data.adId, amount: this.payAmount });
    // const _orderId = _result.orderid;
    // this.router.navigate(['/orderDetail', { orderId: _orderId }]);
    this.adService.transaction({ adid: this.data.adId, amount: this.receiveAmount , coin_amount: this.payAmount }).then(async (data) => {
      const _result = data;
      const _orderId = _result.orderid;
      console.log('order', _result);
      if (_result.order_is_new == 'true') {
        this.router.navigate(['/orderDetailB', { orderId: _orderId,
          adId: this.data.adId, adUserId: this.data.userId, anotherUserId: this.userId }]);
      } else {
        this.dialogService.alert(this.i18ns.goto_old_unfinish_order).subscribe(res => {
          if (res) {
            this.router.navigate(['/orderDetailB', { orderId: _orderId,
              adId: this.data.adId, adUserId: this.data.userId, anotherUserId: this.userId }]);
          }
        });
      }
    }, error => {
      console.error('---------------------error_transaction: ', error);
      if (error.error === 'Insufficient balance') {
        this.dialogService.alert(this.i18ns.insufficient_balance);
      } else if (error.error === 'seller_collection_info_not_complete') {
        this.dialogService.alert(this.i18ns.err_seller_collection_info_not_complete);
      } else if (error.error === 'seller_collection_info_not_ap') {
        this.dialogService.alert(this.i18ns.err_seller_collection_info_not_ap);
      } else if (error.error === 'seller_collection_info_not_wp') {
        this.dialogService.alert(this.i18ns.err_seller_collection_info_not_wp);
      } else if (error.error === 'seller_collection_info_not_bt') {
        this.dialogService.alert(this.i18ns.err_seller_collection_info_not_bt);
      } else if (error.error === 'adv_seller_insufficient_balance') {
        this.dialogService.alert(this.i18ns.err_adv_seller_insufficient_balance);
      } else if (error.error === 'seller_insufficient_balance') {
        this.dialogService.alert(this.i18ns.err_seller_insufficient_balance);
      } else if (error.error === 'buy_sell_has_dispute_order') {
        this.dialogService.alert(this.i18ns.buy_sell_has_dispute_order);
      } else if (error.error === 'reach_maximun_unflnish_order') {
        this.dialogService.alert(this.i18ns.reach_maximun_unflnish_order);
      } else if (error.status === 403 && error.error.userGroup === 'user') {
        this.dialogService.alert(this.i18ns.onlyRealUser);
      } else if (error.error === 'advertisement not found') {
        this.dialogService.alert(this.i18ns.not_trans_as_ad_hidden);
      } else {
        if (error.error) {
          this.dialogService.alert(error.error);
        }
      }
    });

  }

  changePay() {
    const tempCalValue = String(+((this.payAmount * +this.data.rate).toFixed(3)));
    this.receiveAmount = tempCalValue.substring(0, tempCalValue.length - 0);
  }

  changeReceive() {
    const tempCalValue = String(+((this.receiveAmount / +this.data.rate).toFixed(9)));
    this.payAmount = tempCalValue.substring(0, tempCalValue.length - 0);
  }

  getLeftPlacehold() {
    if (this.data.adType === '2') {
      let inputAmount = this.i18ns.input_x_number ;
        inputAmount = inputAmount.replace('{BuyOrSell}', this.i18ns.sale);
      return inputAmount;
    } else if (this.data.adType === '1') {
      return `${this.data.limitMinAmount}-${this.data.limitMaxAmount}`;
    } else {
      return '';
    }
  }

  getRightPlacehold() {
    if (this.data.adType === '2') {
      let inputNumber = this.i18ns.input_x_amount ;
          inputNumber = inputNumber.replace('{BuyOrSell}', this.i18ns.sale);
      return inputNumber;
    } else if (this.data.adType === '1') {
      let inputNumber = this.i18ns.input_x_amount ;
          inputNumber = inputNumber.replace('{BuyOrSell}', this.i18ns.buy);
      return inputNumber;
    } else {
      return '';
    }
  }

  async obtained() {
    this.dialogService.confirm({ content: this.i18ns.confirm_obtained }).subscribe(async res => {
      // 返回结果
      if (res) {
        try {
          let _result = await this.adService.deleteAd({ adid: this.adId });
          this.location.back();
        } catch (e) {
          console.error(e);
        }
      } else {
          return;
      }
    });
  }

  edit() {
    this.router.navigate(['/postAd', { adId: this.adId || '' }]);
  }

  onKeyPress_Pay(value: any) {
    this.payAmount = this.changeValidNumber(value,  8, 6);
    this.changePay();
  }

  onKeyPress_Recevice(value: any) {
    this.receiveAmount = this.changeValidNumber(value,  2, 9);
    this.changeReceive();
  }

  changeValidNumber(objValue,  point , integerLen) {
    let tmpVal = objValue;
    // 先把非数字的都替换掉，除了数字和.
    tmpVal = tmpVal.replace(/[^\d\.]/g, '');
    // 必须保证第一个为数字而不是.
    tmpVal = tmpVal.replace(/^\./g, '');
    // 保证只有出现一个.而没有多个.
    tmpVal = tmpVal.replace(/\.{2,}/g, '');
    // 保证.只出现一次，而不能出现两次以上
    tmpVal = tmpVal.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // 开头多余2个0，只保留一个 000.5 => 0.5
    tmpVal = tmpVal.replace(/^(0{2,})/, "0");

    const p6 = /(\.+)(\d+)(\.+)/g; // 屏蔽1....234.的情况
    tmpVal = tmpVal.replace(p6, '$1$2'); // 屏蔽最后一位的.

    // point = point - 1;

    if (point != undefined && !isNaN(point) && point == 0) { // 如果没有小数位,则不输入小数点
        tmpVal = tmpVal.replace(/\./g, '');
    }

    if (point != undefined && !isNaN(point) && point > 0) {
        var ind = tmpVal.indexOf(".");

        if (ind != -1) {
            point = parseInt(point);
            tmpVal = tmpVal.substring(0, ind + 1 + point);
        }
    }
    if (integerLen != undefined && !isNaN(integerLen) && integerLen > 0) {
        var ind = tmpVal.indexOf(".");
        if (ind != -1) {
            if (ind + 1 > integerLen) {
                var afterPoint = tmpVal.substr(ind);
                var integerPart = tmpVal.substr(0, integerLen);
                tmpVal = integerPart + afterPoint;
            }
        } else {
            tmpVal = tmpVal.substr(0, integerLen);
        }
    }

    // if(tmpVal !=""&&tmpVal!= undefined && !isNaN(tmpVal))
    //  tmpVal = parseFloat(tmpVal);
    return tmpVal;
}


onblur_pay() {
  if (this.payAmount) {
    const tempCalValue1 = String((Number(this.payAmount) * 1.000000000).toFixed(9));
    this.payAmount = tempCalValue1.substring(0, tempCalValue1.length - 1);

    const tempCalValue2 = String((Number(this.receiveAmount) * 1.000).toFixed(3));
    this.receiveAmount = tempCalValue2.substring(0, tempCalValue2.length - 1);
  }
}

onblur_receive() {
  if (this.receiveAmount) {
    const tempCalValue1 = String((Number(this.payAmount) * 1.000000000).toFixed(9));
    this.payAmount = tempCalValue1.substring(0, tempCalValue1.length - 1);

    const tempCalValue2 = String((Number(this.receiveAmount) * 1.000).toFixed(3));
    this.receiveAmount = tempCalValue2.substring(0, tempCalValue2.length - 1);
  }
}


transform(value: any): any {
  if (!value) {
    return value;
  }

  const x = parseFloat(value);
  const x0 = x.toFixed(2);
  const x0Str = x0.toString();
  const i = x0Str.indexOf('.');
  const x1 = x0Str.substr(0, i);
  const x2 = x0Str.substr(i + 1);

  const reg1 = /\B(?=(\d{3})+(?!\d))/g; // 12,345,678
  const xNew = (x1).replace(reg1, '$&,') + '.' + (x2);

  // const reg2 = /\d{1,4}(?=(\d{4})+$)/g; // 1234 5678
  // let xNew = (x1).replace(reg1, '$&,') + '.' + (x2).replace(reg2, '$& ');
  return xNew;
}


}
