import { Injectable } from '@angular/core';
import { HttpService } from "../http/http.service";
import { RouteMap } from "../../models/route-map/route-map.modle";

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private httpService: HttpService) {
  }

  myAccount(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.WALLET.MY_ACCOUNT, params).then(data => {
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

  walletBalance(params: { coin: string, accountType: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.WALLET.WALLET_BALANCE, params).then(data => {
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

  walletAddress(params: { coin: string, accountType: string }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.WALLET.WALLET_ADDRESS, params).then(data => {
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

  walletWidthdraw(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.WALLET.WALLET_WIDTHDRAW, params).then(data => {
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
