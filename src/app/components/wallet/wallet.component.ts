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

  accountType: number = 2;
  mainCoin: { usableAmount: number, freezeAmount: number, currencyAmount: number, currency: string, coinType: string } = {
    usableAmount: 0,
    freezeAmount: 0,
    currencyAmount: 0,
    currency: 'USD',
    coinType: 'BTC'
  };
  coinList: { usableAmount: number, freezeAmount: number, currencyAmount: number, currency: string, coinType: string }[] = [];

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
      let _coinList = await this.commonService.getCoinTypeList();
      for (let i = 0; i < _coinList.length; i++) {
        let _data = _coinList[i];
        let _coin = await this.walletService.walletBalance({coin: _data.code, accountType: 'otc'});
        let _rate = await this.commonService.getCoinRate(_data.code, 'USD');
        this.coinList.push({
          coinType: _data.code,
          usableAmount: _coin.balance,
          freezeAmount: _coin.locked,
          currencyAmount: _coin.balance * _rate.value,
          currency: 'USD',
        });
      }

      if (this.coinList.length > 0) {
        this.mainCoin = this.coinList[0];
      } else {
        this.mainCoin = {usableAmount: 0, freezeAmount: 0, currencyAmount: 0, currency: 'USD', coinType: 'BTC'};
      }
    } catch (e) {
      console.error(e);
    }
  }
}
