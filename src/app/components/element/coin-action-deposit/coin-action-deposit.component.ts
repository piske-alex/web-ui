import { Component, Input, OnInit } from '@angular/core';
import { WalletService } from "../../../providers/wallet/wallet.service";

const QRCode = (<any>window).QRCode;

@Component({
  selector: 'gz-coin-action-deposit',
  templateUrl: './coin-action-deposit.component.html',
  styleUrls: ['./coin-action-deposit.component.scss']
})
export class CoinActionDepositComponent implements OnInit {
  isShowBigImg: boolean = false;

  coinAddress: string;
  coinTag: string;

  @Input()
  coinType: string;

  constructor(private walletService: WalletService) {
  }

  async ngOnInit() {

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
}
