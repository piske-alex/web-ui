import { Injectable } from '@angular/core';
import { RouteMap } from '../../models/route-map/route-map.modle';
import { HttpService } from '../http/http.service';
import { User } from '../../models/user/user';
import { userCollectInfo } from '../../models/user/userCollectInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpService: HttpService) {
  }

  logout(params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.LOGOUT, params).then(data => {
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

  register(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.REGISTER, params).then(data => {
        if (data && data.success) {
          resolve(data.value);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  setNickname(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.SET_NICKNAME, params).then(data => {
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

  setAvatar(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.SET_AVATAR, params).then(data => {
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

  setBanner(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.COMMON.ADD_BANNER, params).then(data => {
        if (data && data.success) {
          resolve(data);
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  forgetPassword(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.FORGET_PASSWORD, params).then(data => {
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

  realCertifiation(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.KYC, params).then(data => {
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

  sendEmailVerifyCode(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.SEND_EMAIL_CODE, params).then(data => {
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

  bindEmail(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.BIND_EMAIL, params).then(data => {
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

  setLanguage(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.SET_LANGUAGE, params).then(data => {
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

  setTransactionPassword(params: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.TRANSACTION_PASSWORD, params).then(data => {
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

  getUserList(params: any): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.LIST_USER, params, true).then(data => {
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

  getDetail(params: any): Promise<User> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.GET_DETAIL, params).then(data => {
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

  getCollectionInfoByUserId(params: any): Promise<userCollectInfo> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.GET_COLLECTION, params).then(data => {
        if (data && data.success) {
          return resolve(userCollectInfo.newInstance(data.data));
        } else {
          reject(data);
        }
      }, error => {
        reject(error);
      });
    });
  }

  addOrUpdateCollectionInfo(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.POST_COLLECTION, params, true).then(data => {
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
  
  postUploadCollectionInfoPicture(params): Promise<any>{
    return new Promise((resolve,reject)=>{
      this.httpService.request(RouteMap.V1.USER.POST_UPLOAD_COLLECTION_PICTURE,params,true).then(data=>{
        if(data&&data.success){
          resolve(data.fileName);
        }else{
          reject(data);
        }
      },error=>{
        reject(error);
      });
    });
  }

  addBlackList(params: any): Promise<User> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.ADD_BLACK_LIST, params, true).then(data => {
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

  addTrustList(params: any): Promise<User> {
    return new Promise((resolve, reject) => {
      this.httpService.request(RouteMap.V1.USER.ADD_TRUST_LIST, params, true).then(data => {
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
