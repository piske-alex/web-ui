import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from "../../../providers/language/language.service";
import { OtcAd } from "../../../models/ad/OtcAd";
import { Router } from "@angular/router";
import { Deal } from "../../../models/ad/Deal";

@Component({
  selector: 'gz-list-deal',
  templateUrl: './list-deal.component.html',
  styleUrls: ['./list-deal.component.scss']
})
export class ListDealComponent implements OnInit {

  @Input()
  list: Deal[];

  i18ns: any = {};

  constructor(private router: Router, private languageService: LanguageService) {
  }

  async ngOnInit() {
    this.i18ns.bid = await this.languageService.get('common.bid');
    this.i18ns.limitAmount = await this.languageService.get('common.limitAmount');
    this.i18ns.buy = await this.languageService.get('common.buy');
    this.i18ns.sale = await this.languageService.get('common.sale');
    this.i18ns.dealPrice = await this.languageService.get('common.dealPrice');
  }

  toTransaction(data: OtcAd) {
    this.router.navigate(['/transaction', {adId: data.id || ''}])
  }

}
