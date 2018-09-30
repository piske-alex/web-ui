import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { TransactionListItem } from '../../../models/ad/TransactionListItem';
import { LanguageService } from '../../../providers/language/language.service';
import { Router } from '@angular/router';
import { AdService } from '../../../providers/ad/ad.service';

@Component({
  selector: 'gz-list-ad-my',
  templateUrl: './list-ad-my.component.html',
  styleUrls: ['./list-ad-my.component.scss']
})
export class ListAdMyComponent implements OnInit {

  @Input()
  list: TransactionListItem[];

  @Input()
  adStatus: string;

  i18ns: any = {};

  public refList: any;


  constructor(private router: Router,
    private languageService: LanguageService,
    private adService: AdService
    ) {
      
  }

  async ngOnInit() {
    console.log('list-ads ', this.list);
    this.i18ns.bid = await this.languageService.get('common.bid');
    this.i18ns.limitAmount = await this.languageService.get('common.limitAmount');
    this.i18ns.buy = await this.languageService.get('common.buy');
    this.i18ns.sale = await this.languageService.get('common.sale');

    this.i18ns.ap_alipay = await this.languageService.get('element_list_trans.ap_alipay');
    this.i18ns.wp_wechatpay = await this.languageService.get('element_list_trans.wp_wechatpay');
    this.i18ns.pp_paypal = await this.languageService.get('element_list_trans.pp_paypal');
    this.i18ns.bt_bank_transfer = await this.languageService.get('element_list_trans.bt_bank_transfer');

    this.i18ns.confirm_obtained = await this.languageService.get('transaction.confirm_obtained');

    this.refList = new EventEmitter();
  }

  toTransaction(data: TransactionListItem) {
    this.router.navigate(['/transaction', {adId: data.adId || ''}]);
  }

  toAdOrders(data: TransactionListItem) {
    this.router.navigate(['/adOrders', {adId: data.adId || '', adType: data.adType || ''}]);
  }

  async obtained(data: TransactionListItem) {
    if (confirm(this.i18ns.confirm_obtained)) {
      try {
        let _result = await this.adService.deleteAd({ adid: data.adId || '' });
        //this.refList();
        this.router.navigate(['/myAd']);
      } catch (e) {
        console.error(e);
      }
    }
  }

}
