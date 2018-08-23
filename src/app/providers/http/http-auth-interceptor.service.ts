import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class HttpAuthInterceptorService {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('access_token');
    const headerKeys = req.headers.keys();
    const headers = {
      'Content-Type': 'application/json',
    };
    if (accessToken) {
      headers['Authorization'] = accessToken;
    }
    for (let i = 0; i < headerKeys.length; i++) {
      headers[headerKeys[i]] = req.headers.get(headerKeys[i]);
    }
    return next
      .handle(req.clone({setHeaders: headers}));
  }
}
