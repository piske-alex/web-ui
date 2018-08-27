import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Country } from '../../models/common/Country';
import { SelectCountryComponent } from '../element/select-country/select-country.component';
import { SelectAdTypeComponent } from '../element/select-ad-type/select-ad-type.component';
import { SelectCoinTypeComponent } from '../element/select-coin-type/select-coin-type.component';
import { SelectCurrencyComponent } from '../element/select-currency/select-currency.component';
import { Currency } from '../../models/common/Currency';
import { CoinType } from '../../models/common/CoinType';
import { SelectPayTypeComponent } from '../element/select-pay-type/select-pay-type.component';
import { PayType } from '../../models/common/PayType';
import { OtcAd } from '../../models/ad/OtcAd';
import { AdService } from '../../providers/ad/ad.service';
import { LanguageService } from '../../providers/language/language.service';
import { CommonService } from '../../providers/common/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gz-post-ad',
  templateUrl: './post-ad.component.html',
  styleUrls: ['./post-ad.component.scss']
})
export class PostAdComponent implements OnInit {

  countryCode = 'CN';
  adTypeCode = '1';
  coinTypeCode = 'BTC';
  currencyCode = 'CNY';
  payTypeCode = 'AP';

  adId: string;

  adType: any = {};
  country: Country = new Country();
  coinType: CoinType = new CoinType();
  currency: Currency = new Currency();
  payType: PayType = new PayType();
  coinRate: number;

  ad: OtcAd = new OtcAd();

  showInnerHelp = false;
  helpContent: string;

  i18ns: any;

  @ViewChild(SelectAdTypeComponent)
  private selectAdTypeComponent;

  @ViewChild(SelectCoinTypeComponent)
  private selectCoinTypeComponent;
  @ViewChild(SelectCountryComponent)
  private selectCountryComponent;
  @ViewChild(SelectCurrencyComponent)
  private selectCurrencyComponent;
  @ViewChild(SelectPayTypeComponent)
  private selectPayTypeComponent;

  constructor(private location: Location,
              private activatedRoute: ActivatedRoute,
              private adService: AdService,
              private languageService: LanguageService,
              private commonService: CommonService) {
  }

  async ngOnInit() {

    this.adId = this.activatedRoute.snapshot.paramMap.get('adId');
    if (this.adId) {
      const _ad = await this.adService.getOtcAdById({adid: this.adId});
      this.countryCode = _ad.country;
      this.adTypeCode = _ad.adType;
      this.coinTypeCode = _ad.transactionCoinType;
      this.currencyCode = _ad.transactionCurrency;
      this.payTypeCode = _ad.payType;
      this.ad.price = +_ad.rate;
      this.ad.minCount = _ad.limitMinAmount;
      this.ad.maxCount = _ad.limitMaxAmount;
      this.ad.remark = _ad.remark;
    }

    this.i18ns = {};
    this.i18ns.publishError = await this.languageService.get('otc.publishError');
    this.i18ns.priceWarn_1 = await this.languageService.get('otc.price_warn_1');
    this.i18ns.priceWarn_2 = await this.languageService.get('otc.price_warn_2');

  }

  goBack() {
    this.location.back();
  }

  async toggleHelp(whichOne: string) {
    if (this.showInnerHelp) {
      this.showInnerHelp = false;
      return;
    }

    console.log('whichOne: ', whichOne);
    switch (whichOne) {
      case 'coinType':
        this.helpContent = await this.languageService.get('otc.post_ad_help_1');
        break;
      case 'maxCount':
        this.helpContent = await this.languageService.get('otc.post_ad_help_2');
        break;
      case 'country':
        this.helpContent = await this.languageService.get('otc.post_ad_help_3');
        break;
      case 'currency':
        this.helpContent = await this.languageService.get('otc.post_ad_help_4');
        break;
      case 'maxPrice':
        this.helpContent = await this.languageService.get('otc.post_ad_help_5');
        break;
      case 'minPrice':
        this.helpContent = await this.languageService.get('otc.post_ad_help_6');
        break;
      case 'minCount':
        this.helpContent = await this.languageService.get('otc.post_ad_help_7');
        break;
      case 'payType':
        this.helpContent = await this.languageService.get('otc.post_ad_help_8');
        break;
    }

    console.log('this.helpContent: ', this.helpContent);
    this.showInnerHelp = true;
  }

  hideInnerHelp() {
    this.showInnerHelp = false;
  }

  checkPrice() {
    const _rate = this.ad.price / this.coinRate;
    if (_rate < 0.9) {
      return window.confirm(this.i18ns.priceWarn_1);
    } else if (_rate > 1.1) {
      return window.confirm(this.i18ns.priceWarn_2);
    }
    return true;
  }

  updatePremium() {
    if (this.ad.premium < -99) {
      this.ad.premium = -99;
    } else if (this.ad.premium > 99) {
      this.ad.premium = 99;
    }
    if (this.ad.premium) {

    }
    // if (this.ad.premium === 0) {
    //   (<any>document.querySelector('.gz-slid-point')).style.left = '50%';
    // } else if (!isNaN(+this.ad.premium)) {
    //   (<any>document.querySelector('.gz-slid-point')).style.left = `${50 + this.ad.premium / 99 * 50}%`;
    // }
  }

  toSelectCountry() {
    this.selectCountryComponent.toSelectCountry();
  }

  selectCountry(data) {
    if (data) {
      this.countryCode = data.code;
      this.country = data;
    }
  }

  toSelectAdType() {
    this.selectAdTypeComponent.toSelect();
  }

  selectAdType(data) {
    if (data) {
      this.adTypeCode = data.code;
      this.adType = data;
    }
  }

  toSelectCoinType() {
    this.selectCoinTypeComponent.toSelect();
  }

  async selectCoinType(data) {
    if (data) {
      this.coinTypeCode = data.code;
      this.coinType = data;
      const _coinTypeCode = this.coinTypeCode;
      const _currencyCode = this.currencyCode;
      const _result = await this.commonService.getCoinRate(_coinTypeCode, _currencyCode);
      if (_coinTypeCode === this.coinTypeCode && _currencyCode === this.currencyCode) {
        this.coinRate = _result.value;
      }
    }
  }

  toSelectCurrency() {
    this.selectCurrencyComponent.toSelect();
  }

  async selectCurrency(data) {
    if (data) {
      this.currencyCode = data.code;
      this.currency = data;
      const _coinTypeCode = this.coinTypeCode;
      const _currencyCode = this.currencyCode;
      const _result = await this.commonService.getCoinRate(_coinTypeCode, _currencyCode);
      if (_coinTypeCode === this.coinTypeCode && _currencyCode === this.currencyCode) {
        this.coinRate = _result.value;
      }
    }
  }

  toSelectPayType() {
    this.selectPayTypeComponent.toSelect();
  }

  selectPayType(data) {
    if (data) {
      this.payTypeCode = data.code;
      this.payType = data;
    }
  }

  selectOpenTime(data) {
    if (data) {
      this.ad.openTime = data;
    }
  }

  async publish() {
    if (!this.checkPrice()) {
      this.ad.price = null;
      return;
    }

    const _remarkWarn = this._validateRemark();
    if (_remarkWarn) {
      return alert(_remarkWarn);
    }

    // this.ad.adType = this.adTypeCode;
    // this.ad.coinType = this.coinTypeCode;
    // this.ad.country = this.countryCode;
    // this.ad.currency = this.currencyCode;
    // this.ad.payType = this.payTypeCode;
    const _params = {
      type: this.adTypeCode === '1' ? 'sell' : 'buy',
      country: this.countryCode,
      currency: this.currencyCode,
      coin: this.coinTypeCode,
      price: this.ad.price,
      payment: this.payTypeCode,
      min: this.ad.minCount,
      max: this.ad.maxCount,
      message: this.ad.remark || '',
      // id: this.adId || '',
    };

    try {
      console.log(_params);
      console.log(JSON.stringify(this.ad));
      const _result = await this.adService.publishOtcAd(_params);
      this.location.back();
    } catch (e) {
      console.error(e);
      alert(e && e.errMsg || this.i18ns.publishError);
    }
  }

  private _validateRemark(): string {
    if (!this.ad.remark) {
      return '请填写留言!';
    }
    return '';
  }

}
