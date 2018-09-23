import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AdService } from '../../providers/ad/ad.service';
import { TransactionListItem } from '../../models/ad/TransactionListItem';
import { LanguageService } from '../../providers/language/language.service';

@Component({
  selector: 'gz-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  data: TransactionListItem = new TransactionListItem();

  i18ns: any = {};
  payAmount: number;
  receiveAmount: number;
  isShowConfirm: boolean;

  userId: string;
  adId: string;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private adService: AdService,
    private languageService: LanguageService) {
  }

  async ngOnInit() {
    this.userId = localStorage.getItem('user_id');
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

    try {
      this.data = await this.adService.getOtcAdById({ adid: this.adId });

    } catch (e) {
      console.error(e);
    }

  }


  goBack() {
    this.location.back();
  }

  goToHelp() {
    this.router.navigate(['/help', { type: 'sell' }])
  }

  goToChat() {
    this.router.navigate(['/chat', { adId: this.adId }])
  }

  getRemark() {
    return this.i18ns.adRemark + ': ' + (this.data.remark || '');
  }

  getLeftTopTxt() {
    return this.i18ns.transactionLimit + ' ' + this.data.limitMinAmount + '~' + this.data.limitMaxAmount + ' ' + this.data.transactionCurrency;
  }

  async transaction() {
    if (this.data.adType === '1') {
      let _payDes = '买入';
      if (!this.payAmount) {
        alert('请输入' + _payDes + '金额');
      } else if (this.payAmount < this.data.limitMinAmount) {
        alert('最少' + _payDes + '数量为' + this.data.limitMinAmount);
      } else if (this.payAmount > this.data.limitMaxAmount) {
        alert('最大' + _payDes + '数量为' + this.data.limitMaxAmount);
      } else {
        this.isShowConfirm = true;
      }
    }
  }

  cancelTransaction() {
    this.isShowConfirm = false;
  }

  confirmTransaction() {
    this.isShowConfirm = false;

    // const _result = await this.adService.transaction({ adid: this.data.adId, amount: this.payAmount });
    // const _orderId = _result.orderid;
    // this.router.navigate(['/orderDetail', { orderId: _orderId }]);
    this.adService.transaction({ adid: this.data.adId, amount: this.payAmount }).then(async (data) => {
      const _result = data;
      const _orderId = _result.orderid;
      this.router.navigate(['/orderDetail', { orderId: _orderId }]);
    }, error => {
      console.error('---------------------error_transaction: ', error);
      if (error.status === 403 && error.error.userGroup === 'user') {
        alert('受限功能，请先通过实名认证');
      } else {
        alert(error.message);
      }
    });

  }

  changePay() {

    if (this.data.adType === '1') {
      this.receiveAmount = +((this.payAmount / +this.data.rate).toFixed(8));
    } else {
      this.receiveAmount = +((this.payAmount * +this.data.rate).toFixed(2));
    }
  }

  changeReceive() {
    if (this.data.adType === '1') {
      this.payAmount = +((this.receiveAmount * +this.data.rate).toFixed(2));
    } else {
      this.payAmount = +((this.receiveAmount / +this.data.rate).toFixed(8));
    }
  }

  getLeftPlacehold() {
    if (this.data.adType === '2') {
      return `请输入卖出金额`;
    } else if (this.data.adType === '1') {
      return `${this.data.limitMinAmount}-${this.data.limitMaxAmount}`;
    } else {
      return '';
    }
  }

  getRightPlacehold() {
    if (this.data.adType === '2') {
      return `请输入卖出数量`;
    } else if (this.data.adType === '1') {
      return `请输入买入的数量`;
    } else {
      return '';
    }
  }

  async obtained() {
    if (confirm('确定下架吗？')) {
      try {
        let _result = await this.adService.deleteAd({ adid: this.adId });
        this.location.back();
      } catch (e) {
        console.error(e);
      }
    }
  }

  edit() {
    this.router.navigate(['/postAd', { adId: this.adId || '' }])
  }



  onlyInputFloatPay(e) {
    let evt = (e) ? e : window.event;
    let key = (evt.keyCode) ? evt.keyCode : evt.which;
  
    let objValue = String( this.payAmount);
  
    if ((objValue.indexOf(".") !== -1 && key === 46)) {
      
        return false;
    }

    if (isNaN(this.payAmount)) {
      this.payAmount = 0;
      return  false;
    }

    this.payAmount = this.changeValidNumber(objValue, 2, 9);
 
  }

  onlyInputFloatReceive(e) {
    let evt = (e) ? e : window.event;
    let key = (evt.keyCode) ? evt.keyCode : evt.which;
  
    let objValue = String( this.receiveAmount);

    if (isNaN(this.receiveAmount)) {
      this.receiveAmount = 0;
      return  false;
    }
  
    if ((objValue.indexOf(".") !== -1 && key === 46)) {
         console.log(objValue);
        return false;
    }

    

    this.receiveAmount = this.changeValidNumber(objValue,  6, 9);
 
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

    point = point - 1;

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

    return tmpVal;
}


}
