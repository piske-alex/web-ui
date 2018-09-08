import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { AdService } from "../../providers/ad/ad.service";
import { TransactionListItem } from "../../models/ad/TransactionListItem";
import { LanguageService } from "../../providers/language/language.service";

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
    if (this.data.adType == '1') {
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

  async confirmTransaction() {
    const _result = await this.adService.transaction({ adid: this.data.adId, amount: this.payAmount });
    const _orderId = _result.orderid;
    this.router.navigate(['/orderDetail', { orderId: _orderId }]);
  }

  changePay() {
    if (this.data.adType == '1') {
      this.receiveAmount = +((this.payAmount / +this.data.rate).toFixed(8));
    } else {
      this.receiveAmount = +((this.payAmount * +this.data.rate).toFixed(2));
    }
  }

  changeReceive() {
    if (this.data.adType == '1') {
      this.payAmount = +((this.receiveAmount * +this.data.rate).toFixed(2));
    } else {
      this.payAmount = +((this.receiveAmount / +this.data.rate).toFixed(8));
    }
  }

  getLeftPlacehold() {
    if (this.data.adType == '2') {
      return `请输入卖出金额`;
    } else if (this.data.adType == '1') {
      return `${this.data.limitMinAmount}-${this.data.limitMaxAmount}`;
    } else {
      return '';
    }
  }

  getRightPlacehold() {
    if (this.data.adType == '2') {
      return `请输入卖出数量`;
    } else if (this.data.adType == '1') {
      return `请输入买入的数量`;
    } else {
      return '';
    }
  }

  async obtained() {
    try {
      let _result = await this.adService.deleteAd({ adid: this.adId });
      this.location.back();
    } catch (e) {
      console.error(e);
    }
  }

  edit() {
    this.router.navigate(['/postAd', { adId: this.adId || '' }])
  }

}
