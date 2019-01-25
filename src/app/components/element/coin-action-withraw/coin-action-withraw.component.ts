import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WalletService } from '../../../providers/wallet/wallet.service';
import { LanguageService } from '../../../providers/language/language.service';
import { DialogService } from '../../../providers/dialog/dialog.service';
import { Constants } from '../../../models/common/Constants';

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
  trans_fee: number ;
  min_amount: number ;
  remark: string;
  paypassword: string;


  coinBalance: { balance: string, locked: string, total: string , usableAmount: string} = {
    balance: '0.00000000',
    locked: '0.00000000',
    total: '0.00000000',
    usableAmount: '0.00000000',
  };

  @Input()
  coinType: string;

  i18ns: any = {};

  constructor(private router: Router,
              private languageService: LanguageService,
              private walletService: WalletService,
              private dialogService: DialogService) {
  }

  async ngOnInit() {

    this.i18ns.withrawProcessingHelp = await this.languageService.get('wallet.withrawProcessingHelp');
    // this.i18ns.input_address = await this.languageService.get('element_coin_withraw.input_address');
    this.i18ns.remark = await this.languageService.get('element_coin_withraw.remark');
    this.i18ns.input_trans_password = await this.languageService.get('element_coin_withraw.input_trans_password');
    this.i18ns.input_amount = await this.languageService.get('element_coin_withraw.input_amount');
    this.i18ns.err_input_amount_min = await this.languageService.get('element_coin_withraw.err_input_amount_min');

    this.i18ns.input_remark = await this.languageService.get('element_coin_withraw.input_remark');
    this.i18ns.input_address = await this.languageService.get('element_coin_withraw.input_address');
    this.i18ns.input_address = this.i18ns.input_address.replace(/\$\{coinType\}/g, this.coinType);

    this.i18ns.send_address = await this.languageService.get('element_coin_withraw.send_address');

    this.i18ns.notice_info_tmp = await this.languageService.get('element_coin_withraw.notice_info');
    this.i18ns.notice_info = await this.languageService.get('element_coin_withraw.notice_info');
    this.i18ns.send_address = this.i18ns.send_address.replace(/\$\{coinType\}/g, this.coinType);
    this.i18ns.notice_info = this.i18ns.notice_info.replace(/\$\{coinType\}/g, this.coinType);
    if (this.coinType == 'BTC') {
      this.min_amount = 0.01;
    } else if (this.coinType == 'LTC') {
      this.min_amount = 0.1;
    } else if (this.coinType == 'USDT') {
      this.min_amount = 0.01; // 20190106 lcy ,should be 200
    } else {
      this.min_amount = 0.01;
    }

    this.i18ns.notice_info_tmp = this.i18ns.notice_info_tmp.replace(/\$\{coinType\}/g, this.coinType);
    this.i18ns.notice_info_tmp = this.i18ns.notice_info_tmp.replace(/\$\{trans_fee\}/g, 0.001);
    this.i18ns.notice_info_tmp = this.i18ns.notice_info_tmp.replace(/\$\{min_amount\}/g, this.min_amount);

    await this.walletService.walletBalance({coin: this.coinType, accountType: 'otc'}).then(data => {
      data.total = (+data.balance - +data.locked).toFixed(8);
      data.usableAmount = (+data.balance -  +data.locked).toFixed(8);
      this.coinBalance = data;
      this.trans_fee = data.withdraw_fee;
      this.i18ns.notice_info = this.i18ns.notice_info.replace(/\$\{trans_fee\}/g, this.trans_fee);
      this.i18ns.notice_info = this.i18ns.notice_info.replace(/\$\{min_amount\}/g, this.min_amount);
      this.i18ns.notice_info_tmp = this.i18ns.notice_info;
    }, error => {
      console.error(error);
    });

    

    this.i18ns.err_paypassword_invalid = await this.languageService.get('element_coin_withraw.err_paypassword_invalid');
    this.i18ns.err_address_invalid = await this.languageService.get('element_coin_withraw.err_address_invalid');
    this.i18ns.err_coin_network_error = await this.languageService.get('element_coin_withraw.err_coin_network_error');
    this.i18ns.err_insufficient_balance = await this.languageService.get('element_coin_withraw.err_insufficient_balance');
    this.i18ns.send_success = await this.languageService.get('element_coin_withraw.send_success');

    this.i18ns.paypassword_invalid = await this.languageService.get('otc.paypassword_invalid');
    this.i18ns.paypassword_notfound = await this.languageService.get('otc.paypassword_notfound');
    this.i18ns.err_PasswordNotActive = await this.languageService.get('otc.err_PasswordNotActive');

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

    if ( Number(this.amount) < Number(this.min_amount) )  {
      return this.dialogService.alert(this.i18ns.err_input_amount_min);
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
      address: this.address.trim(),
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
          this.dialogService.alert(this.i18ns.send_success).subscribe(
            res => {
            //  this.router.navigate(['/coinAction', {coinType: this.coinType, action: Constants.COIN_ACTIONS.WITHRAW}]);
              // coinAction;coinType=BTC;action=withraw
            // this.router.navigateByUrl('/', {skipLocationChange: true}).then( () => {
            //   this.router.navigate(['/coinAction', {coinType: this.coinType,
            // action: Constants.COIN_ACTIONS.DEPOSIT, rand: Math.random()}]);
            //   console.log('_result---1-', data);
            // }, errRedirect => {
            //   this.router.navigate(['/coinAction', {coinType: this.coinType,
            // action: Constants.COIN_ACTIONS.DEPOSIT, rand: Math.random()}]);
            //   console.log('_result---2-', data);
            // }
            // );
            }
          );
        // }
      }, err => {
        console.log('err----', err);
        if (err.error) {
          if (err.error == 'address invaild') {
            this.dialogService.alert(this.i18ns.err_address_invalid);
          } else if (err.error == 'coin network error') {
            this.dialogService.alert(this.i18ns.err_coin_network_error);
          } else if (err.error == 'Insufficient balance') {
            this.dialogService.alert(this.i18ns.err_insufficient_balance);
          } else {
            if (err.error.name) {
              if (err.error.name == 'NotFoundError') {
                this.dialogService.alert(this.i18ns.paypassword_notfound);
              } else if (err.error.name == 'PasswordInvalid') {
                this.dialogService.alert(this.i18ns.paypassword_invalid);
              } else if (err.error.name == 'PasswordNotActive') {
                let passwordNotActive = this.i18ns.err_PasswordNotActive;
                const activetime  = err.error.active.toLocaleString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                passwordNotActive = passwordNotActive.replace('{0}', activetime);
                this.dialogService.alert(passwordNotActive);
              }
            } else {
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

  addressOnblur() {
    this.address = this.address.trim();
  }

}
