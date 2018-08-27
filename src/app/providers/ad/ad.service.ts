import { Injectable } from '@angular/core';
import { HttpService } from "../http/http.service";
import { RouteMap } from "../../models/route-map/route-map.modle";
import { TransactionListItem } from "../../models/ad/TransactionListItem";
import { OtcAd } from "../../models/ad/OtcAd";
import { Deal } from "../../models/ad/Deal";

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private httpService: HttpService) {
  }

  publishOtcAd(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.AD.PUBLISH_OTC_AD, params, true).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * 查询交易列表
   * @param params
   * @returns {Promise<{ list: TransactionListItem[], total: number }>}
   */
  listTransactionList(params): Promise<{ list: TransactionListItem[], total: number }> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.AD.LIST_TRANSACTION, params).then(data => {
        if (data && data.success) {
          let _result = {list: [], total: 0};
          if (data.data && data.data.length > 0) {
            _result.list = data.data.map(_data => {
              return TransactionListItem.newInstance(_data);
            });
            _result.total = data.total;
          }
          resolve(_result);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * 交易列表
   * @param params
   * @returns {Promise<Deal[]>}
   */
  listDealList(params): Promise<Deal[]> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.AD.DEAL_TRANSACTION, params, true).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * 查询 广告列表
   * @param params
   * @returns {Promise<OtcAd>}
   */
  listOtcAd(params): Promise<OtcAd[]> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.AD.LIST_OTC_AD, params).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  getOtcAdById(params): Promise<TransactionListItem> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.AD.GET_OTC_AD, params).then(data => {
        if (data && data.success) {
          resolve(TransactionListItem.newInstance(data.data));
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  transaction(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.AD.TRANSACTION_AD, params, true).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  getOrder(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.AD.GET_ORDER, params, true).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  updateOrderStatus(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.AD.UPDATE_ORDER_STATUS, params, true).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  otcTrending(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.AD.OTC_TRENDING, params, true).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  deleteAd(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.AD.DELETE_AD, params, true).then(data => {
        if (data && data.success) {
          resolve(data.data);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }


}
