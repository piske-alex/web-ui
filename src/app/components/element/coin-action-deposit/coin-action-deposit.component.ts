import { Component, Input, OnInit } from '@angular/core';
import { WalletService } from "../../../providers/wallet/wallet.service";
import { LanguageService } from "../../../providers/language/language.service";

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

    this.i18ns.depositWillReceiveHelp = this.i18ns.depositWillReceiveHelp.replace(/\$\{coinTYpe\}/g, this.coinType);

    this._loadWillReceiveTransaction();
    try {
      let _result = await this.walletService.walletAddress({coin: this.coinType, accountType: 'otc'});
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
      this.willReceiveTransactions = await this.walletService.walletTransaction({
        accountType: 'otc',
        type: 'receive',
        offset: 0,
        limit: 1000
      });
      this.willReceiveTransactions = this.willReceiveTransactions.filter(_data => {
        return _data.type === 'receive';
      });
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
