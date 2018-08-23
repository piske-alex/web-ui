import { Component, Input, OnInit } from '@angular/core';
import { WalletService } from "../../../providers/wallet/wallet.service";

@Component({
  selector: 'gz-coin-action-withraw',
  templateUrl: './coin-action-withraw.component.html',
  styleUrls: ['./coin-action-withraw.component.scss']
})
export class CoinActionWithrawComponent implements OnInit {

  address: string;
  amount: number;
  remark: string;

  @Input()
  coinType: string;

  constructor(private walletService: WalletService) {
  }

  ngOnInit() {

  }

  async submit() {
    let _params = {
      coin: this.coinType,
      accountType: 'otc',
      address: this.address,
      amount: this.amount,
    };
    try {
      await this.walletService.walletWidthdraw(_params);
    } catch (e) {
      console.error(e);
    }
  }

}
