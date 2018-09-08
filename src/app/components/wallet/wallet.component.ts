import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Constants } from "../../models/common/Constants";
import { WalletService } from "../../providers/wallet/wallet.service";
import { LanguageService } from "../../providers/language/language.service";
import { CommonService } from "../../providers/common/common.service";

@Component({
  selector: 'gz-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  isLoading = false;

  accountType = 2;
  mainCoin: any = {
    usableAmount: '0.00000000',
    freezeAmount: '0.00000000',
    totalAmount: '0.00000000',
    currencyAmount: '0.00',
    currency: 'CNY',
    coinType: 'BTC'
  };
  coinList: any;
  defaultCurrency = 'CNY';

  i18ns: any = {};

  constructor(private router: Router,
              private commonService: CommonService,
              private walletService: WalletService,
              private languageService: LanguageService) {
  }

  async ngOnInit() {

    this.i18ns.title = await this.languageService.get('wallet.title');
    this.i18ns.cointEqualsCurrency = await this.languageService.get('wallet.cointEqualsCurrency');
    this.i18ns.deposit = await this.languageService.get('wallet.deposit');
    this.i18ns.transfer = await this.languageService.get('wallet.transfer');
    this.i18ns.withraw = await this.languageService.get('wallet.withraw');
    this.i18ns.usable = await this.languageService.get('wallet.usable');
    this.i18ns.freeze = await this.languageService.get('wallet.freeze');

    this.loadAccount();
  }

  goToCoinAction(data) {
    this.router.navigate(['/coinAction', {coinType: data.coinType, action: Constants.COIN_ACTIONS.DEPOSIT}]);
  }

  goToCoinActionDeposit() {
    this.router.navigate(['/coinSelect', {action: Constants.COIN_ACTIONS.DEPOSIT}]);
  }

  goToCoinActionTransfer() {
    this.router.navigate(['/coinSelect', {action: Constants.COIN_ACTIONS.TRANSFER}]);
  }

  goToCoinActionWithraw() {
    this.router.navigate(['/coinSelect', {action: Constants.COIN_ACTIONS.WITHRAW}]);
  }

  private async loadAccount() {
    try {
      this.isLoading = true;
      let _coins = await this.walletService.walletBalance({coin: '', accountType: 'otc'});
      this.coinList = [];
      for (let _coin in _coins) {
        let _data = _coins[_coin];
        this.coinList.push({
          coinType: _coin,
          usableAmount: _data.balance,
          freezeAmount: _data.locked,
        });
      }
      if (this.coinList && this.coinList.length > 0) {
        let _data = this.coinList[0];
        let _rate = await this.commonService.getCoinRate(_data.coinType, this.defaultCurrency);
        this.mainCoin = {
          coinType: _data.coinType,
          usableAmount: _data.usableAmount,
          freezeAmount: _data.freezeAmount,
          totalAmount: (+_data.usableAmount + +_data.freezeAmount).toFixed(8),
          rate: _rate.value,
          currencyAmount: '0.00',
          currency: this.defaultCurrency,
        };
        this.mainCoin.currencyAmount = (this.mainCoin.totalAmount * this.mainCoin.rate).toFixed(2);
      }

      this.isLoading = false;

    } catch (e) {
      console.error(e);
    }
  }
}
