import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionListItem } from '../../../models/ad/TransactionListItem';
import { LanguageService } from '../../../providers/language/language.service';

@Component({
  selector: 'gz-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.scss']
})
export class ListTransactionComponent implements OnInit {

  @Input()
  public transactionList: TransactionListItem[];

  @Input()
  adType: string;

  userId: string;

  i18ns: any = {};

  constructor(private languageService: LanguageService, private router: Router) {
    this.userId = localStorage.getItem('user_id');
  }

  async ngOnInit() {
    this.i18ns.ap_alipay = await this.languageService.get('element_list_trans.ap_alipay');
    this.i18ns.wp_wechatpay = await this.languageService.get('element_list_trans.wp_wechatpay');
    this.i18ns.pp_paypal = await this.languageService.get('element_list_trans.pp_paypal');
    this.i18ns.bt_bank_transfer = await this.languageService.get('element_list_trans.bt_bank_transfer');
  }

  toTransaction(data: TransactionListItem) {
    this.router.navigate(['/transaction', { adId: data.adId || '' }]);
  }

  toTransactionB(data: TransactionListItem) {
    this.router.navigate(['/transactionB', { adId: data.adId || '' }]);
  }

  toAdOrders(data: TransactionListItem) {
    this.router.navigate(['/adOrders', { adId: data.adId || '' , adUserId: data.userId || ''}]);
  }

  toUserDetail(adUserId: string) {
    this.router.navigate(['/user', { userId: adUserId, coinType: '' }]);
  }

}
