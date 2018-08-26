import { Injectable } from '@angular/core';
import { HttpService } from "../http/http.service";
import { RouteMap } from "../../models/route-map/route-map.modle";
import { Currency } from "../../models/common/Currency";
import { Country } from "../../models/common/Country";
import { CoinType } from "../../models/common/CoinType";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private httpService: HttpService) {
  }

  getCountryList(): Promise<Country[]> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.COMMON.COUNTRY).then(data => {
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

  getCountryCodeList(): Promise<{ code: string, name: string }[]> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.COMMON.COUNTRY_CODE).then(data => {
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

  getCoinTypeList(): Promise<CoinType[]> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.COMMON.COIN_TYPE).then(data => {
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

  getCurrencyList(): Promise<Currency[]> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.COMMON.CURRENCY).then(data => {
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

  getPayTypeList(): Promise<Currency[]> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.COMMON.PAY_TYPE).then(data => {
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

  getLanguage(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.COMMON.LANGUAGE).then(data => {
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
      let _params: any = {};
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


}
