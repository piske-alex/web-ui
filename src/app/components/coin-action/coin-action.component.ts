import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Constants } from "../../models/common/Constants";
import { Location } from "@angular/common";
import { WalletService } from "../../providers/wallet/wallet.service";

@Component({
  selector: 'gz-coin-action',
  templateUrl: './coin-action.component.html',
  styleUrls: ['./coin-action.component.scss']
})
export class CoinActionComponent implements OnInit {
  coinType: string;
  action: string; // deposit, transfer, withraw
  coinBalance: any = {};

  constructor(private location: Location,
              private router: Router,
              private route: ActivatedRoute,
              private walletService: WalletService) {
  }

  async ngOnInit() {
    this.coinType = this.route.snapshot.paramMap.get('coinType');
    this.action = this.route.snapshot.paramMap.get('action');

    // try {
    //   this.coinBalance = await this.walletService.walletBalance({coin: this.coinType, accountType: 'otc'});
    //   this.coinBalance.allBalance = (+this.coinBalance.balance + +this.coinBalance.locked).toFixed(8);
    // } catch (e) {
    //   console.error(e);
    // }

    this.walletService.walletBalance({coin: this.coinType, accountType: 'otc'}).then(data => {
      data.allBalance = (+data.balance + +data.locked).toFixed(8);
      data.usableAmount = (+data.balance -  +data.locked).toFixed(8);
      this.coinBalance = data;
    }, error => {
      console.error(error);
    });

  }

  goBack() {
    this.location.back();
  }

  goToTransactionList() {
    this.router.navigate(['/transactionList', {coinType: this.coinType}]);
  }

  isDeposit() {
    return this.action === Constants.COIN_ACTIONS.DEPOSIT;
  }

  isTransfer() {
    return this.action === Constants.COIN_ACTIONS.TRANSFER;
  }

  isWithraw() {
    return this.action === Constants.COIN_ACTIONS.WITHRAW;
  }

  toDeposit() {
    this.action = Constants.COIN_ACTIONS.DEPOSIT;
  }

  toTransfer() {
    this.action = Constants.COIN_ACTIONS.TRANSFER;
  }

  toWithraw() {
    this.action = Constants.COIN_ACTIONS.WITHRAW;
  }

}
