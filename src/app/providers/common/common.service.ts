import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { RouteMap } from '../../models/route-map/route-map.modle';
import { Currency } from '../../models/common/Currency';
import { Country } from '../../models/common/Country';
import { CoinType } from '../../models/common/CoinType';
import { TradeItem } from '../../models/common/TradeItem';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  cache: any = {};

  constructor(private httpService: HttpService) {
  }

  listMyTradeList(params): Promise<{ list: TradeItem[], total: any }> {
    return new Promise((resolve, reject) => {
      if (this.cache['myTradeList'] !== undefined) {
        resolve(this.cache['myTradeList']);
      } else {
        this.httpService.request(RouteMap.V1.AD.GET_TRANS_BY_USERID, params).then(data => {
          if (data && data.success) {
            // this.cache['myTradeList'] = data.data;
            let _result = {list: [], total: 0};
            if (data.data && data.data.length > 0) {
              _result.list = data.data.map(_data => {
                return TradeItem.newInstance(_data);
              });
              _result.total = data.total;
            }
            resolve(_result);
          } else {
            reject(data.errMsg);
          }
        }, error => {
          reject(error);
        });
      }
    });
  }


  getCountryList(): Promise<Country[]> {
    return new Promise((resolve, reject) => {
      if (this.cache['CountryList'] !== undefined) {
        resolve(this.cache['CountryList']);
      } else {
        this.httpService.request(RouteMap.V1.COMMON.COUNTRY).then(data => {
          if (data && data.success) {
            this.cache['CountryList'] = data.data;
            resolve(data.data);
          } else {
            reject(data.errMsg);
          }
        }, error => {
          reject(error);
        });
      }
    });
  }

  getCountryCodeList(): Promise<{ code: string, name: string }[]> {
    return new Promise((resolve, reject) => {
      if (this.cache['CountryCodeList'] !== undefined) {
        resolve(this.cache['CountryCodeList']);
      } else {
        this.httpService.request(RouteMap.V1.COMMON.COUNTRY_CODE).then(data => {
          if (data && data.success) {
            this.cache['CountryCodeList'] = data.data;
            resolve(data.data);
          } else {
            reject(data.errMsg);
          }
        }, error => {
          reject(error);
        });
      }
    });
  }

  getCoinTypeList(): Promise<CoinType[]> {
    return new Promise((resolve, reject) => {
      if (this.cache['CoinTypeList'] !== undefined) {
        resolve(this.cache['CoinTypeList']);
      } else {
        this.httpService.request(RouteMap.V1.COMMON.COIN_TYPE).then(data => {
          if (data && data.success) {
            this.cache['CoinTypeList'] = data.data;
            resolve(data.data);
          } else {
            reject(data.errMsg);
          }
        }, error => {
          reject(error);
        });
      }
    });
  }

  getCurrencyList(): Promise<Currency[]> {
    return new Promise((resolve, reject) => {
      if (this.cache['CurrencyList'] !== undefined) {
        resolve(this.cache['CurrencyList']);
      } else {
        this.httpService.request(RouteMap.V1.COMMON.CURRENCY).then(data => {
          if (data && data.success) {
            this.cache['CurrencyList'] = data.data;
            resolve(data.data);
          } else {
            reject(data.errMsg);
          }
        }, error => {
          reject(error);
        });
      }
    });
  }

  getPayTypeList(): Promise<Currency[]> {
    return new Promise((resolve, reject) => {
      if (this.cache['PayTypeList'] !== undefined) {
        resolve(this.cache['PayTypeList']);
      } else {
        this.httpService.request(RouteMap.V1.COMMON.PAY_TYPE).then(data => {
          if (data && data.success) {
            this.cache['PayTypeList'] = data.data;
            resolve(data.data);
          } else {
            reject(data.errMsg);
          }
        }, error => {
          reject(error);
        });
      }
    });
  }

  getLanguage(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (this.cache['LanguageList'] !== undefined) {
        resolve(this.cache['LanguageList']);
      } else {
        this.httpService.request(RouteMap.V1.COMMON.LANGUAGE).then(data => {
          if (data && data.success) {
            this.cache['LanguageList'] = data.data;
            resolve(data.data);
          } else {
            reject(data.errMsg);
          }
        }, error => {
          reject(error);
        });
      }
    });
  }


  sendSmsCode(params): Promise<{ smsCode: string }> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.COMMON.SMS_CODE, params).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data.errMsg);
        }
      }, error => {
        reject(error);
      });
    });
  }

  getCoinRate(coin: string, currency: string): Promise<{ value: number }> {
    return new Promise((resolve, reject) => {
      const _params: any = {};
      if (coin) {
        _params.coin = coin;
      }
      if (currency) {
        _params.currency = currency;
      }
      // { coin: coin, currency: currency }
      this.httpService.request(RouteMap.V1.COMMON.COIN_RATE, _params).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data.errMsg);
        }
      }, error => {
        reject(error);
      });
    });
  }

  getBannerList(params): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (this.cache['BannerList'] !== undefined) {
        resolve(this.cache['BannerList']);
      } else {
        this.httpService.request(RouteMap.V1.COMMON.GET_BANNERS, params).then(data => {
          if (data && data.success) {
            this.cache['BannerList'] = data.data;
            resolve(data.data);
          } else {
            reject(data.errMsg);
          }
        }, error => {
          reject(error);
        });
      }
    });
  }

  getBannerInfo(params): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.COMMON.GET_BANNERS, params).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data.errMsg);
        }
      }, error => {
        reject(error);
      });
    });
  }

}
