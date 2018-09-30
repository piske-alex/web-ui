import { Component, Input, OnInit } from '@angular/core';
import { WalletService } from '../../../providers/wallet/wallet.service';
import { LanguageService } from '../../../providers/language/language.service';

const QRCode = (<any>window).QRCode;

@Component({
  selector: 'gz-coin-action-deposit',
  templateUrl: './coin-action-deposit.component.html',
  styleUrls: ['./coin-action-deposit.component.scss']
})
export class CoinActionDepositComponent implements OnInit {
  isShowBigImg: boolean = false;
  isShowInnerHelp = false;
  helpContent: string = '';

  isLoading = false;
  isLoadingTransaction = false;

  coinAddress: string;
  coinTag: string;
  willReceiveTransactions: { "txid": string, "coin": string, "type": string, "amount": string, "confirm": number }[] = [];

  i18ns: any = {};

  @Input()
  coinType: string;

  constructor(private languageService: LanguageService,
              private walletService: WalletService) {
  }

  async ngOnInit() {

    this.i18ns.depositWillReceiveHelp = await this.languageService.get('wallet.depositWillReceiveHelp');
    this.i18ns.to_address_recharge = await this.languageService.get('element_coin_deposit.to_address_recharge');
    this.i18ns.attention_info = await this.languageService.get('element_coin_deposit.attention_info');

    this.i18ns.depositWillReceiveHelp = this.i18ns.depositWillReceiveHelp.replace(/\$\{coinTYpe\}/g, this.coinType);
    this.i18ns.to_address_recharge = this.i18ns.to_address_recharge.replace(/\$\{coinType\}/g, this.coinType);
    this.i18ns.attention_info = this.i18ns.attention_info.replace(/\$\{coinType\}/g, this.coinType);

    this._loadWillReceiveTransaction();
    try {
      this.isLoading = true;
      let _result = await this.walletService.walletAddress({coin: this.coinType, accountType: 'otc'});
      this.isLoading = false;
      this.coinAddress = _result.address;
      this.coinTag = _result.tag;


      new QRCode(document.getElementById("qrcode"), {
        text: this.coinAddress,
        width: 60,
        height: 60,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    } catch (e) {
      console.error(e);
    }

  }

  private async _loadWillReceiveTransaction() {
    try {
      this.isLoadingTransaction = true;
      this.willReceiveTransactions = await this.walletService.walletTransaction({
        accountType: 'otc',
        type: 'receive',
        offset: 0,
        limit: 1000
      });
      this.willReceiveTransactions = this.willReceiveTransactions.filter(_data => {
        return _data.type === 'receive';
      });
      this.isLoadingTransaction = false;
    } catch (e) {
      console.error(e);
    }
  }

  showBigImg() {
    this.isShowBigImg = true;
    setTimeout(() => {
      new QRCode(document.getElementById("qrcodeFull"), {
        text: this.coinAddress,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }, 25);
  }

  hideBigImg() {
    this.isShowBigImg = false;
  }

  showInnerHelp() {
    this.helpContent = this.i18ns.depositWillReceiveHelp;
    this.isShowInnerHelp = true;
  }

  hideInnerHelp() {
    this.isShowInnerHelp = false;
  }

  refreshWillReceive() {
    this._loadWillReceiveTransaction();
  }
}
