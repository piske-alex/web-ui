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
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../providers/dialog/dialog.service';

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
  payTypeNames = '';

  userId: string;
  adId: string;

  adType: any = {};
  country: Country = new Country();
  coinType: CoinType = new CoinType();
  currency: Currency = new Currency();
  payType: PayType[];
  coinRate: number;

  ad: OtcAd = new OtcAd();

  showInnerHelp = false;
  helpContent: string;

  i18ns: any = {};

  private _isSubmiting = false;

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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adService: AdService,
    private languageService: LanguageService,
    private commonService: CommonService,
    private dialogService: DialogService) {
  }

  async ngOnInit() {
    const _accessToken = localStorage.getItem('access_token');
    if (!_accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = localStorage.getItem('user_id');
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.adId = this.activatedRoute.snapshot.paramMap.get('adId');
    if (this.adId) {
      const _ad = await this.adService.getOtcAdById({ adid: this.adId });
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

    let adfee:number = 2;
    await this.commonService.getSettingInfo({key:"OTC_ad_fee"}).then( d => {
      if (!isNaN(d)) adfee = parseFloat(d) * 100;
    }, error => {});

    this.i18ns.adWarning_2 = await this.languageService.get('otc.adWarning_2');
    this.i18ns.adWarning_2 = this.i18ns.adWarning_2.replace('{0}', adfee);
    this.i18ns.publishError = await this.languageService.get('otc.publishError');
    this.i18ns.priceWarn_1 = await this.languageService.get('otc.price_warn_1');
    this.i18ns.priceWarn_2 = await this.languageService.get('otc.price_warn_2');
    this.i18ns.onlyRealUser = await this.languageService.get('otc.onlyRealUser');
    this.i18ns.input_remark = await this.languageService.get('otc.input_remark');

    this.i18ns.input_price = await this.languageService.get('otc.input_price');
    this.i18ns.input_minCount = await this.languageService.get('otc.input_minCount');
    this.i18ns.input_maxCount = await this.languageService.get('otc.input_maxCount');
    this.i18ns.input_maxCountMoreThanMin = await this.languageService.get('otc.input_maxCountMoreThanMin');
    this.i18ns.insufficient_balance = await this.languageService.get('otc.insufficient_balance');
    this.i18ns.payType =  await this.languageService.get('otc.payType');
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

  checkPrice(event) {
    const _rate = this.ad.price / this.coinRate;
    if (_rate < 0.9) {
      this.dialogService.confirm({ content: this.i18ns.priceWarn_1 }).subscribe(res => {
        if (res) {
          this.doPublish(event);
        } else {
          event.next(2);
          return false;
        }
      });

    } else if (_rate > 1.1) {
      this.dialogService.confirm({ content: this.i18ns.priceWarn_2 }).subscribe(res => {
        if (res) {
          this.doPublish(event);
        } else {
          event.next(2);
          return false;
        }
      });
    } else {
      this.doPublish(event);
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
    this.selectPayTypeComponent.toSelect(this.i18ns.payType);
  }

  selectPayType(data) {
    if (data) {
      this.payType = data || [];
      const _payTypeCodes = [];
      const _payTypeNames = [];
      this.payType.forEach(_data => {
        _payTypeCodes.push(_data.code);
        _payTypeNames.push(_data.name);
      });
      this.payTypeCode = _payTypeCodes.join(',');
      this.payTypeNames = _payTypeNames.join(',');
    }
  }

  selectOpenTime(data) {
    if (data) {
      this.ad.openTime = data;
    }
  }

  async publish(event) {
    console.log('aaaa -- 001');
    if (this._isSubmiting) {
      return;
    }
    console.log('aaaa -- 002');
    const _remarkWarn = this._validateRemark();
    if (_remarkWarn) {
      console.log('aaaa -- 003');
      event.next(2);
      return this.dialogService.alert(_remarkWarn);
    }
    console.log('aaaa -- 004');
    if (!this.checkPrice(event)) {
      this.ad.price = null;
      this._isSubmiting = false;
      console.log('aaaa -- 005');
      event.next(2);
      return;
    }
  }

  async doPublish(event) {


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
      this._isSubmiting = true;
      // const _result = await this.adService.publishOtcAd(_params);
      await this.adService.publishOtcAd(_params).then(async (data) => {
        const _result = data;
        setTimeout(() => {
          this._isSubmiting = false;
          event.next(2);
        }, 1000);
        // this.location.back();
        this.router.navigate(['/otc', { adType: this.adTypeCode, coinType: this.coinTypeCode, countryCode: this.countryCode }]);
      }, error => {
        this._isSubmiting = false;
        console.error('---------------------error_publishOtcAd: ', error);
        if (error.status === 403 && (error.userGroup === 'user' || error.error.userGroup === 'user')) {
          this.dialogService.alert(this.i18ns.onlyRealUser);
        } else {
          if (error.error == 'Insufficient balance') {
            this.dialogService.alert(this.i18ns.insufficient_balance);
          } else {
            this.dialogService.alert( this.i18ns.publishError);
          }
        }
        event.next(2);
      });
    } catch (e) {
      this._isSubmiting = false;
      console.error(e);
      this.dialogService.alert(e && e.errMsg || this.i18ns.publishError);
      event.next(2);
    }
  }

  private _validateRemark(): string {
    let price = isNaN(Number(this.ad.price)) ? 0 : Number(this.ad.price);
    let minCnt = isNaN(Number(this.ad.minCount)) ? 0 : Number(this.ad.minCount);
    let maxCnt = isNaN(Number(this.ad.maxCount)) ? 0 : Number(this.ad.maxCount);

    if (price <= 0) {
      return this.i18ns.input_price;
    }
    if (minCnt <= 0) {
      return this.i18ns.input_minCount;
    }
    if (maxCnt <= 0) {
      return this.i18ns.input_maxCount;
    }
    if (maxCnt < minCnt) {
      return this.i18ns.input_maxCountMoreThanMin;
    }
    if (!this.ad.remark || this.ad.remark.trim() == "") {
      return this.i18ns.input_remark;
    }
    return '';
  }

  onKeyPress_Price(value: any) {
    this.ad.price = this.changeValidNumber(value,  2, 9) ;
  }

  onKeyPress_Min(value: any) {
    this.ad.minCount = this.changeValidNumber(value,  2, 9) ;
  }

  onKeyPress_Max(value: any) {
    this.ad.maxCount = this.changeValidNumber(value,  2, 9) ;
  }

  changeValidNumber(objValue,  point , integerLen) {
    let tmpVal = objValue;
    // 先把非数字的都替换掉，除了数字和
    tmpVal = tmpVal.replace(/[^\d\.]/g, '');
    // 必须保证第一个为数字而不是
    tmpVal = tmpVal.replace(/^\./g, '');
    // 保证只有出现一个.而没有多个
    tmpVal = tmpVal.replace(/\.{2,}/g, '');
    // 保证.只出现一次，而不能出现两次以上
    tmpVal = tmpVal.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
    // 开头多余2个0，只保留一个 000.5 => 0.5
    tmpVal = tmpVal.replace(/^(0{2,})/, "0");

    const p6 = /(\.+)(\d+)(\.+)/g; // 屏蔽1....234.的情况
    tmpVal = tmpVal.replace(p6, '$1$2'); // 屏蔽最后一位的.

    if (point != undefined && !isNaN(point) && point == 0) { // 如果没有小数位,则不输入小数点
        tmpVal = tmpVal.replace(/\./g, '');
    }

    if (point != undefined && !isNaN(point) && point > 0) {
        var ind = tmpVal.indexOf(".");
        if (ind != -1) {
            point = parseInt(point);
            tmpVal = tmpVal.substring(0, ind + 1 + point);
        }
    }
    if (integerLen != undefined && !isNaN(integerLen) && integerLen > 0) {
        var ind = tmpVal.indexOf(".");
        if (ind != -1) {
            if (ind + 1 > integerLen) {
                var afterPoint = tmpVal.substr(ind);
                var integerPart = tmpVal.substr(0, integerLen);
                tmpVal = integerPart + afterPoint;
            }
        } else {
            tmpVal = tmpVal.substr(0, integerLen);
        }
    }
    return tmpVal;
}

formatChar(event){
  //event.target.value = event.target.value.replace(/[^\w\u4e00-\u9fa5\s\-,。,]/gi, '');
  let v = event.replace(/[^\w\u4e00-\u9fa5\s\-,。,]/gi, '');
  this.ad.remark = v;
}

}
