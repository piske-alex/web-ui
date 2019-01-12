import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from '../../models/common/Country';
import { SelectCountryComponent } from '../element/select-country/select-country.component';
import { LanguageService } from '../../providers/language/language.service';
import { CommonService } from '../../providers/common/common.service';
import { AdService } from '../../providers/ad/ad.service';
import { TransactionListItem } from '../../models/ad/TransactionListItem';
import { PayType } from '../../models/common/PayType';
import { Currency } from '../../models/common/Currency';
import { CoinType } from '../../models/common/CoinType';
import { SelectCoinTypeComponent } from '../element/select-coin-type/select-coin-type.component';
import { SelectPayTypeComponent } from '../element/select-pay-type/select-pay-type.component';
import { SelectCurrencyComponent } from '../element/select-currency/select-currency.component';
import { DialogService } from '../../providers/dialog/dialog.service';
import { HostListener} from '@angular/core';

const $ = (<any>window).$;

let ScrollTimer;

@Component({
  selector: 'gz-otc',
  templateUrl: './otc.component.html',
  styleUrls: ['./otc.component.scss']
})
export class OtcComponent implements OnInit, OnDestroy {
  showAddList = false;
  isShowSearch = false;
  isLoading = false;
  isShowLoadMore = false;
  isLoadMoreing = false;

  coinTypes: any;

  adList: TransactionListItem[];
  adTotal: number;

  countryCode = 'CN';
  coinTypeCode = 'BTC';
  currencyCode = 'CNY';
  payTypeCode = 'AP';
  payTypeNames = '';

  country: Country = new Country();
  coinType: CoinType = new CoinType();
  currency: Currency = new Currency();
  payType: PayType[];

  @ViewChild(SelectCountryComponent)
  private selectCountryComponent;
  @ViewChild(SelectCoinTypeComponent)
  private selectCoinTypeComponent;
  @ViewChild(SelectCurrencyComponent)
  private selectCurrencyComponent;
  @ViewChild(SelectPayTypeComponent)
  private selectPayTypeComponent;

  filter: any = {};

  i18ns: any = {};
  scrollAdIndex = 0;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private adService: AdService,
    private languageService: LanguageService,
    private dialogService: DialogService) {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
   let winScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
   // console.log('winScroll', winScroll);
   let divOffHeight = document.querySelector('.gz-transaction-list').scrollHeight;
   // console.log('divOffHeight', divOffHeight);
   if (winScroll + 500 > divOffHeight) {
    this.loadMoreList();
   }
  }

  async ngOnInit() {
    this._updateScroll('otc', 4, true);

    let _adType = this.route.snapshot.paramMap.get('adType');
    let _coinType = this.route.snapshot.paramMap.get('coinType');
    let _countryCode = this.route.snapshot.paramMap.get('countryCode');

    if (_adType == '1') {
      _adType = '2';
    } else if (_adType == '2') {
      _adType = '1';
    }
    this.coinTypes = await this.commonService.getCoinTypeList();
    if ( this.coinTypes.length > 0 ) {
      this.coinTypeCode = this.coinTypes[0].code;
      console.log ('sssssssssssssss', this.coinTypes[0].code);
    }


    this.coinTypeCode = _coinType || this.coinTypeCode;
    this.countryCode = _countryCode || this.countryCode;

    this.filter.adType = _adType || '2'; // 1 出售, 2 购买
    this.filter.coinType = this.coinTypeCode;
    this.filter.countryCode = this.countryCode;
    // this.filter.currencyCode = this.currencyCode;
    // this.filter.payTypeCode = this.payTypeCode;
    this.filter.currencyCode = '';
    this.filter.payTypeCode = '';

    this.i18ns.listError = await this.languageService.get('otc.listError');

    // this.loadList();
    this.follow();

    this.autoScroll();
  }

  ngOnDestroy() {
  }

  search() {
    this.isShowSearch = false;

    this.filter.coinType = this.coinTypeCode;
    this.filter.countryCode = this.countryCode;
    this.filter.currencyCode = this.currencyCode;
    this.filter.payTypeCode = this.payTypeCode;

    this.loadList();
  }

  private async loadList() {
    try {
      const _params = {
        type: this.filter.adType === '2' ? 'sell' : 'buy',
        country: this.filter.countryCode,
        coin: this.filter.coinType,
        currency: this.filter.currencyCode,
        payment: this.filter.payTypeCode,
        offset: 0,
        limit: 15,
        // userid: '',
      };
      this.isLoading = true;
      const _result = await this.adService.listTransactionList(_params);
      this.isLoading = false;
      // console.error('otc -list ', _result);

      // this.adList = _result.list.sort((obj1, obj2) => {
      //   if (obj1.rate > obj2.rate) {
      //       return 1;
      //   }
      //   if (obj1.rate < obj2.rate) {
      //       return -1;
      //   }
      //   return 0;
      // });

      this.adList = _result.list;
      this.adTotal = _result.total;
      console.error('_result.total', _result.total);
      if (_result.total > this.adList.length) {
        this.isShowLoadMore = true;
      } else {
        this.isShowLoadMore = false;
      }

    } catch (e) {
      this.isLoading = false;
      console.error(e);
      if (e.message) {
        this.dialogService.alert(e.message);
      }

    }

  }

  private async loadMoreList() {
    if (this.isLoadMoreing) {
      return ;
    }
    this.isLoadMoreing = true;
    try {
      let currentListLength = 0;
      if (this.adList) {
        currentListLength = this.adList.length;
      }
      console.log('load more length', currentListLength);
      const _params = {
        type: this.filter.adType === '2' ? 'sell' : 'buy',
        country: this.filter.countryCode,
        coin: this.filter.coinType,
        currency: this.filter.currencyCode,
        payment: this.filter.payTypeCode,
        offset: currentListLength,
        limit: 15,
        // userid: '',
      };
      // this.isLoading = true;
      const _result = await this.adService.listTransactionList(_params);
      this.isLoading = false;
      // console.error('otc -list ', _result);

      // this.adList = _result.list.sort((obj1, obj2) => {
      //   if (obj1.rate > obj2.rate) {
      //       return 1;
      //   }
      //   if (obj1.rate < obj2.rate) {
      //       return -1;
      //   }
      //   return 0;
      // });
      if (this.adList) {
        const tempList = this.adList.concat(_result.list);
        this.adList = tempList;
        // let len = _result.list.length;
        // for (let i = 0; i < len; i++) {
        //   this.adList.push(_result.list[i]);
        // }
      } else {
        this.adList = _result.list;
      }

      this.adTotal = _result.total;

      if (_result.total > this.adList.length) {
        this.isShowLoadMore = true;
      } else {
        this.isShowLoadMore = false;
      }
      this.isLoadMoreing = false;
    } catch (e) {
      this.isLoading = false;
      this.isLoadMoreing = false;
      console.error(e);
      if (e.message) {
        this.dialogService.alert(e.message);
      }

    }

  }

  private _updateScroll(scrollName, scrollSize, isFullImg) {
    if ($(`.gz-ad-slide-${scrollName}`).find('.gz-ad-slide-img').find('ul').find('li').length) {
      let _innerWidth = innerWidth - 20;
      if (isFullImg) {
        _innerWidth = innerWidth;
      }
      $(`.gz-ad-slide-${scrollName}`).find('.gz-ad-slide-imgs').width(_innerWidth * scrollSize);
      $(`.gz-ad-slide-${scrollName}`).find('.gz-ad-slide-img').width(_innerWidth);
      $(`.gz-ad-slide-${scrollName}`).find('.gz-ad-slide-img').find('ul').find('li').width(_innerWidth);
      $(`.gz-ad-slide-${scrollName}`).find('.gz-ad-slide-circle').find('li').eq(0).addClass('gz-active');
      if (isFullImg) {
        $(`.gz-ad-slide-${scrollName}`).find('.gz-ad-slide-img').find('ul').find('li').find('img').width(_innerWidth);
      }
    } else {
      setTimeout(() => {
        this._updateScroll(scrollName, scrollSize, isFullImg);
      }, 25);
    }
  }

  private async autoScroll() {
    if (ScrollTimer === undefined) {
      ScrollTimer = setTimeout(() => {
        ScrollTimer = undefined;
        const _imgUl = $('.gz-ad-slide-otc').find('.gz-ad-slide-img').find('ul');
        const lineWidth = _imgUl.find('li:first').width();

        _imgUl.animate({
          'marginLeft': -lineWidth + 'px'
        }, 500, () => {
          this.scrollAdIndex = (++this.scrollAdIndex) % 4;
          $('.gz-ad-slide-otc').find('.gz-ad-slide-circle').find('li').removeClass('gz-active');
          $('.gz-ad-slide-otc').find('.gz-ad-slide-circle').find('li').eq(this.scrollAdIndex).addClass('gz-active');
          _imgUl.css({
            marginLeft: 0
          }).find('li:first').appendTo(_imgUl);
        });
        this.autoScroll();
      }, 2000);
    }
  }

  selectAdType(adType) {
    this.filter.adType = adType;
    this.loadList();
  }

  selectType(type) {
    this.coinTypeCode = type.code;
    this.coinType = type;
    this.filter.coinType = type.code;

    this.loadList();
  }

  toSelectCountry() {
    this.selectCountryComponent.toSelectCountry();
  }

  selectCountry(data) {
    if (data) {
      this.countryCode = data.code;
      this.country = data;
      this.filter.countryCode = this.countryCode;
      this.loadList();
    }
  }

  toSelectCoinType() {
    this.selectCoinTypeComponent.toSelect();
  }

  selectCoinType(data) {
    if (data) {
      this.coinTypeCode = data.code;
      this.coinType = data;
    }
  }

  toSelectCurrency() {
    this.selectCurrencyComponent.toSelect();
  }

  async selectCurrency(data) {
    if (data) {
      this.currencyCode = data.code;
      this.currency = data;
    }
  }

  toSelectPayType() {
    this.selectPayTypeComponent.toSelect();
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

  toggleAddList() {
    this.showAddList = !this.showAddList;
  }

  showSearch() {
    this.isShowSearch = true;
    this.showAddList = false;
  }

  hideSearch() {
    this.isShowSearch = false;
  }

  goToPostAd() {
    this.showAddList = false;
    this.router.navigate(['/postAd']);
  }

  goToMyAd() {
    this.showAddList = false;
    this.router.navigate(['/myAd']);
  }

  goToMyTrans() {
    this.showAddList = false;
    this.router.navigate(['/myTrans']);
  }


  goToTrust() {
    this.showAddList = false;
    this.router.navigate(['/trustList']);
  }

  goToMyMsg() {
    this.showAddList = false;
    this.router.navigate(['/myMsg']);
  }


  isActiveAdType(adType: string) {
    return this.filter.adType === adType ? 'gz-active' : '';
  }

  follow(){
    let oDiv: any = document.getElementsByClassName("fixPara")[0],
        H = 0;
    let Y: any = oDiv;   
    let origCls = oDiv.className; 
    let origTop = oDiv.style.top;
    let origWidth = document.getElementsByClassName("gz-header-container")[0].clientWidth;
    let gdTop = document.getElementsByClassName("gz-header-container")[0].clientHeight + document.getElementsByClassName("gz-pc-menu")[0].clientHeight;
    let adHeight = document.getElementsByClassName("adSwiperHeader")[0].clientHeight;
    while (Y) {
        H += Y.offsetTop; 
        Y = Y.offsetParent;
    }
    window.onscroll = function()
    {
        var s = document.body.scrollTop || document.documentElement.scrollTop;
        
        if(s > adHeight) {
            //console.log(origWidth)
            oDiv.style.top = gdTop + "px";
            oDiv.style.position = "fixed";
            oDiv.style.width = origWidth + "px";
            
        } else {
            oDiv.style.top = origTop;
            oDiv.style.position = "";
          }
    }
  }



}
