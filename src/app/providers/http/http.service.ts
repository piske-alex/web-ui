import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RouteJson, RouteMap } from '../../models/route-map/route-map.modle';
import { Observable, Subject,throwError  } from 'rxjs/index';
import { LanguageService } from '../../providers/language/language.service';
import { catchError ,timeout } from 'rxjs/operators';

@Injectable()
export class HttpService {

  private isLoading: boolean = false;
  private authSubject: Subject<boolean> = new Subject();

  constructor(private http: HttpClient, private languageService: LanguageService) {
  }

  openLoading() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    // TODO add loading...

    setTimeout(() => {
      this.closeLoading();
    }, 65000);
  }

  closeLoading() {
    if (this.isLoading) {
      this.isLoading = false;
      // TODO close loading...
    }
  }

  request(routeJson: RouteJson, params: any = {}, isNeedUserId: boolean = false, isLoading: boolean = false): Promise<any> {
    let method = routeJson.method;
    let requestUrl = routeJson.url;
    let observable: Observable<Object>;

    if (isLoading) {
      this.openLoading();
    }

    if (isNeedUserId) {
      // let _userId = localStorage.getItem('user_id');
      // params = params || {};
      // params.userId = params.userId || _userId;
    }

    switch (method) {
      case RouteMap.METHODS.GET:
        observable = this.http.get(requestUrl, {params: params});
        break;
      case RouteMap.METHODS.POST:
        observable = this.http.post(requestUrl, JSON.stringify(params))
            .pipe(timeout(120000));
        break;
      case RouteMap.METHODS.PUT:
        observable = this.http.put(requestUrl, JSON.stringify(params));
        break;
      case RouteMap.METHODS.DELETE:
        observable = this.http.request(RouteMap.METHODS.DELETE, requestUrl, {params: params});
        break;
      // default:
      //   ;
    }

    return new Promise((resolve, reject) => {
      if (observable) {
        observable.subscribe(
          data => {
            resolve(data);
            if (isLoading) {
              this.closeLoading();
            }
          },
          error => {
            console.log('error at http service', error);
            if ( error && error.name && error.name == 'TimeoutError') {
              reject(error);
              return;
            }

            if (isLoading) {
              this.closeLoading();
            }
            // console.log('---------------------error_http res status: ', error);
            if (error && error.status === 401) {
              // 如果是401
              this.gotoLogin();
              resolve({success: false, message: error.error || '请先登录!'});
            } else if (error.success === false) {
              if (error.message === 'Unauthorized' || error.message  === 'unauthorized') {
                const msg =  this.languageService.get('otc.Unauthorized');
                resolve({success: false, message: msg});
              }
            } else {
              reject(error);
            }
          });
      } else {
        reject('未知请求方法');
      }
    });

  }

  gotoLogin() {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    localStorage.removeItem('login_timestamp');
    localStorage.removeItem('access_token');
    this.sendAuthMessage(false);
  }

  sendAuthMessage(message: boolean) {
    this.authSubject.next(message);
  }

  getAuthMessage(): Observable<boolean> {
    return this.authSubject.asObservable();
  }
}
