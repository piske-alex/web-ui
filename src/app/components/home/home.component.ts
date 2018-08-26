import { Component, OnInit } from '@angular/core';
import { CommonService } from "../../providers/common/common.service";
import { AdService } from "../../providers/ad/ad.service";
import { Router } from "@angular/router";

const $ = (<any>window).$;

@Component({
  selector: 'gz-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  coinPrice = [];
  otcTransactions: any = [];
  scrollAdIndex = {
    ad: 0,
    homeotc: 0,
  };

  payTypeObj: any = {};

  constructor(private router: Router,
              private commonService: CommonService,
              private adService: AdService) {
  }

  async ngOnInit() {

    this._updateScroll('ad', 4, true);

    this.commonService.getCoinRate('', '').then(data => {
      for (let coinType in data) {
        this.coinPrice.push({
          // TODO
        });
      }
    }, error => {
      console.error(error);
    });

    try {
      let _payTypes = await this.commonService.getPayTypeList();
      (_payTypes || []).forEach(_data => {
        this.payTypeObj[_data.code] = _data;
      });
    } catch (e) {
      console.error(e);
    }

    try {
      this.otcTransactions = await this.adService.otcTrending({});
      (this.otcTransactions || []).forEach(_data => {
        _data = _data || [];
        const _len = _data.length;
        for (let i = 0; i < 3 - _len; i++) {
          _data.push({});
        }
      });
    } catch (e) {
      console.error(e);
    }

    this._updateScroll('homeotc', this.otcTransactions.length, false);
    this.autoScroll('ad', 4);
    setTimeout(() => {
      this.autoScroll('homeotc', this.otcTransactions.length);
    }, 800);

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

  private async autoScroll(scrollName, scrollSize) {
    // scrollInterval[scrollName] = setInterval(() => {
    const _intervalName = setInterval(() => {
      const _imgUl = $(`.gz-ad-slide-${scrollName}`).find('.gz-ad-slide-img').find('ul');
      const lineWidth = _imgUl.find('li:first').width();

      _imgUl.animate({
        'marginLeft': -lineWidth + 'px'
      }, 500, () => {
        this.scrollAdIndex[scrollName] = this.scrollAdIndex[scrollName] + 1;
        this.scrollAdIndex[scrollName] = (this.scrollAdIndex[scrollName]) % scrollSize;
        $(`.gz-ad-slide-${scrollName}`).find('.gz-ad-slide-circle').find('li').removeClass('gz-active');
        $(`.gz-ad-slide-${scrollName}`).find('.gz-ad-slide-circle').find('li').eq(this.scrollAdIndex[scrollName]).addClass('gz-active');
        _imgUl.css({
          marginLeft: 0
        }).find('li:first').appendTo(_imgUl);
      });
    }, 2000);

    const _checkIntervalName = setInterval(() => {
      if (!/.*(\/home)(\/)?$/.test(location.href)) {
        clearInterval(_intervalName);
        clearInterval(_checkIntervalName);
        return;
      }
    }, 100);
  }

  toTransaction(adId: string) {
    this.router.navigate(['/transaction', {adId: adId || ''}])
  }

}
