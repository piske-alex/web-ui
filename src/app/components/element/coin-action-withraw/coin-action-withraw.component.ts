import { Component, Input, OnInit } from '@angular/core';
import { WalletService } from '../../../providers/wallet/wallet.service';
import { LanguageService } from '../../../providers/language/language.service';

@Component({
  selector: 'gz-coin-action-withraw',
  templateUrl: './coin-action-withraw.component.html',
  styleUrls: ['./coin-action-withraw.component.scss']
})
export class CoinActionWithrawComponent implements OnInit {

  isLoadingTransaction = false;

  transactions: any[] = [];
  isShowInnerHelp = false;
  helpContent = '';

  address: string;
  amount: number | string;
  remark: string;
  paypassword: string;
 

  coinBalance: { balance: string, locked: string, total: string } = {
    balance: '0.00000000',
    locked: '0.00000000',
    total: '0.00000000',
  };

  @Input()
  coinType: string;

  i18ns: any = {};

  constructor(private languageService: LanguageService,
              private walletService: WalletService) {
  }

  async ngOnInit() {

    this.i18ns.withrawProcessingHelp = await this.languageService.get('wallet.withrawProcessingHelp');
    this.i18ns.input_address = await this.languageService.get('element_coin_withraw.input_address');
    this.i18ns.remark = await this.languageService.get('element_coin_withraw.remark');
    this.i18ns.input_trans_password = await this.languageService.get('element_coin_withraw.input_trans_password');
    this.i18ns.input_address = await this.languageService.get('element_coin_withraw.input_address');
    this.i18ns.input_address = this.i18ns.input_address.replace(/\$\{coinType\}/g, this.coinType);

    this.i18ns.send_address = await this.languageService.get('element_coin_withraw.send_address');
    this.i18ns.notice_info = await this.languageService.get('element_coin_withraw.notice_info');
    this.i18ns.send_address = this.i18ns.send_address.replace(/\$\{coinType\}/g, this.coinType);
    this.i18ns.notice_info = this.i18ns.notice_info.replace(/\$\{coinType\}/g, this.coinType);

    this.walletService.walletBalance({coin: this.coinType, accountType: 'otc'}).then(data => {
      data.total = (+data.balance + +data.locked).toFixed(8);
      this.coinBalance = data;
    }, error => {
      console.error(error);
    });

    this._loadProcessingTransaction();
  }

  private async _loadProcessingTransaction() {
    try {
      this.isLoadingTransaction = true;
      this.transactions = await this.walletService.walletTransaction({
        accountType: 'otc',
        type: 'send',
        offset: 0,
        limit: 1000
      });

      this.transactions = this.transactions.filter(_data => {
        return _data.type === 'send';
      });
      this.isLoadingTransaction = false;
    } catch (e) {
      console.error(e);
    }
  }

  async submit() {

    let _params = {
      coin: this.coinType,
      accountType: 'otc',
      address: this.address,
      amount: this.amount,
      paypassword: this.paypassword,
      tag: this.remark,
    };
    try {
      let _result = await this.walletService.walletWidthdraw(_params);
      if (_result && _result.success) {
        this.address = '';
        this.amount = '';
        this.paypassword = '';
        this.remark = '';
      }
    } catch (e) {
      console.error(e);
    }
  }

  showInnerHelp() {
    this.helpContent = this.i18ns.withrawProcessingHelp;
    this.isShowInnerHelp = true;
  }

  hideInnerHelp() {
    this.isShowInnerHelp = false;
  }

  refreshWillReceive() {
    this._loadProcessingTransaction();
  }

}
