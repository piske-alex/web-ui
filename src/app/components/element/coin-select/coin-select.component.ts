import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { CommonService } from "../../../providers/common/common.service";
import { LanguageService } from "../../../providers/language/language.service";

@Component({
  selector: 'gz-coin-select',
  templateUrl: './coin-select.component.html',
  styleUrls: ['./coin-select.component.scss']
})
export class CoinSelectComponent implements OnInit {
  action: string;
  coinList: any[];

  i18ns: any = {};

  constructor(private location: Location,
              private router: Router,
              private route: ActivatedRoute,
              private languageService: LanguageService,
              private commonService: CommonService) {
  }

  async ngOnInit() {

    this.i18ns.selectCoin = await this.languageService.get('wallet.selectCoin');

    this.action = this.route.snapshot.paramMap.get('action');
    this.coinList = await this.commonService.getCoinTypeList();
  }

  goBack() {
    this.location.back();
  }

  goToAction(coin: any) {
    this.router.navigate(['/coinAction', {coinType: coin.code, action: this.action}]);
  }
}
