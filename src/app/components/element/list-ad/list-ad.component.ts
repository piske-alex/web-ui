import { Component, Input, OnInit } from '@angular/core';
import { TransactionListItem } from '../../../models/ad/TransactionListItem';
import { LanguageService } from '../../../providers/language/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'gz-list-ad',
  templateUrl: './list-ad.component.html',
  styleUrls: ['./list-ad.component.scss']
})
export class ListAdComponent implements OnInit {

  @Input()
  list: TransactionListItem[];

  i18ns: any = {};

  constructor(private router: Router, private languageService: LanguageService) {
  }

  async ngOnInit() {
    // console.log('list-ads ', this.list);
    this.i18ns.bid = await this.languageService.get('common.bid');
    this.i18ns.limitAmount = await this.languageService.get('common.limitAmount');
    this.i18ns.buy = await this.languageService.get('common.buy');
    this.i18ns.sale = await this.languageService.get('common.sale');

    this.i18ns.ap_alipay = await this.languageService.get('element_list_trans.ap_alipay');
    this.i18ns.wp_wechatpay = await this.languageService.get('element_list_trans.wp_wechatpay');
    this.i18ns.pp_paypal = await this.languageService.get('element_list_trans.pp_paypal');
    this.i18ns.bt_bank_transfer = await this.languageService.get('element_list_trans.bt_bank_transfer');
  }

  toTransaction(data: TransactionListItem) {
    this.router.navigate(['/transaction', {adId: data.adId || ''}]);
  }
  toTransactionB(data: TransactionListItem) {
    this.router.navigate(['/transactionB', {adId: data.adId || ''}]);
  }
}
