import { Component, Input, OnInit } from '@angular/core';
import { WalletService } from '../../../providers/wallet/wallet.service';
import { LanguageService } from '../../../providers/language/language.service';
import { DialogService } from '../../../providers/dialog/dialog.service';

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
              private walletService: WalletService,
              private dialogService: DialogService) {
  }

  async ngOnInit() {

    this.i18ns.withrawProcessingHelp = await this.languageService.get('wallet.withrawProcessingHelp');
    // this.i18ns.input_address = await this.languageService.get('element_coin_withraw.input_address');
    this.i18ns.remark = await this.languageService.get('element_coin_withraw.remark');
    this.i18ns.input_trans_password = await this.languageService.get('element_coin_withraw.input_trans_password');
    this.i18ns.input_amount = await this.languageService.get('element_coin_withraw.input_amount');
    this.i18ns.input_remark = await this.languageService.get('element_coin_withraw.input_remark');
    this.i18ns.input_address = await this.languageService.get('element_coin_withraw.input_address');
    this.i18ns.input_address = this.i18ns.input_address.replace(/\$\{coinType\}/g, this.coinType);

    this.i18ns.send_address = await this.languageService.get('element_coin_withraw.send_address');
    this.i18ns.notice_info = await this.languageService.get('element_coin_withraw.notice_info');
    this.i18ns.send_address = this.i18ns.send_address.replace(/\$\{coinType\}/g, this.coinType);
    this.i18ns.notice_info = this.i18ns.notice_info.replace(/\$\{coinType\}/g, this.coinType);

    this.i18ns.err_paypassword_invalid = await this.languageService.get('element_coin_withraw.err_paypassword_invalid');
    this.i18ns.err_address_invalid = await this.languageService.get('element_coin_withraw.err_address_invalid');
    this.i18ns.err_coin_network_error = await this.languageService.get('element_coin_withraw.err_coin_network_error');
    this.i18ns.err_insufficient_balance = await this.languageService.get('element_coin_withraw.err_insufficient_balance');
    this.i18ns.send_success = await this.languageService.get('element_coin_withraw.send_success');

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
        coin: this.coinType,
        confirm: 0,
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
    if (!this.address || this.address.trim() == '') {
      return this.dialogService.alert(this.i18ns.input_address);
    }

    if (!this.amount  ) {
      return this.dialogService.alert(this.i18ns.input_amount);
    }

    if (!this.paypassword || this.paypassword.trim() == '') {
      return this.dialogService.alert(this.i18ns.input_trans_password);
    }

    if (!this.remark || this.remark.trim() == '') {
      return this.dialogService.alert(this.i18ns.input_remark);
    }

    let _params = {
      coin: this.coinType,
      accountType: 'otc',
      address: this.address,
      amount: this.amount,
      paypassword: this.paypassword,
      tag: this.remark,
    };
    try {
      this.walletService.walletWidthdraw(_params).then( data => {
        console.log('_result----', data);
        // if (data && data.success) {
          this.address = '';
          this.amount = '';
          this.paypassword = '';
          this.remark = '';
          this.dialogService.alert(this.i18ns.send_success);
        // }
      }, err => {
        console.log('err----', err);
        if (err.error) {
          if (err.error == 'password wrong') {
            this.dialogService.alert(this.i18ns.err_paypassword_invalid);
          } else if (err.error == 'address invaild') {
            this.dialogService.alert(this.i18ns.err_address_invalid);
          } else if (err.error == 'coin network error') {
            this.dialogService.alert(this.i18ns.err_coin_network_error);
          } else if (err.error == 'Insufficient balance') {
            this.dialogService.alert(this.i18ns.err_insufficient_balance);
          } else {
            if (err.error) {
              this.dialogService.alert(err.error);
            }
          }
        }
      });
    } catch (e) {
      console.log('catch----', e);
      if (e.error) {
      if (e.error == 'password wrong') {
        this.dialogService.alert(this.i18ns.err_paypassword_invalid);
      } else if (e.error == 'address invaild') {
        this.dialogService.alert(this.i18ns.err_address_invalid);
      } else if (e.error == 'coin network error') {
        this.dialogService.alert(this.i18ns.err_coin_network_error);
      } else if (e.error == 'Insufficient balance') {
        this.dialogService.alert(this.i18ns.err_insufficient_balance);
      } else {
          this.dialogService.alert(e.error);
        }
      }
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
