import { Component, Input, OnInit } from '@angular/core';
import { WalletService } from "../../../providers/wallet/wallet.service";
import { LanguageService } from "../../../providers/language/language.service";

@Component({
  selector: 'gz-coin-action-withraw',
  templateUrl: './coin-action-withraw.component.html',
  styleUrls: ['./coin-action-withraw.component.scss']
})
export class CoinActionWithrawComponent implements OnInit {

  transactions: any[] = [];
  isShowInnerHelp = false;
  helpContent = '';

  address: string;
  amount: number;
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
      this.transactions = await this.walletService.walletTransaction({
        accountType: 'otc',
        type: 'send',
        offset: 0,
        limit: 1000
      });

      this.transactions = this.transactions.filter(_data => {
        return _data.type === 'send';
      });
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
    };
    try {
      await this.walletService.walletWidthdraw(_params);
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
