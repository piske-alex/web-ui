import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject } from "rxjs/index";


/*
app.module.ts:
this.languageService.initConfig(this.language);
 */

/*
    if (this.languageService.isReady) {
      this.getI18n();
    }else {
      this.languageService.onReady().subscribe(isReady => {
        this.getI18n();
      });
    }
*/
@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  list = ["zh-CN", "en-GB"];
  isReady: boolean;
  private readySubject: Subject<boolean> = new Subject();
  private changeSubject: Subject<string> = new Subject();

  constructor(private translateService: TranslateService) {
  }

  get(key: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.isReady) {
        resolve(this.translateService.instant(key));
      } else {
        this.onReady().subscribe(isReady => {
          resolve(this.translateService.instant(key));
        });
      }
    });
  }

  initConfig(language: string) {
    this.isReady = false;
    this.translateService.addLangs(this.list);
    this.translateService.setDefaultLang(language);
    this.translateService.use(language)
      .subscribe(() => {
        this.isReady = true;
        this.readySubject.next(this.isReady);
      });
  }

  onReady(): Observable<boolean> {
    return this.readySubject.asObservable();
  }

  change(code) {
    this.changeSubject.next(code);
  }

  onChange(): Observable<string> {
    return this.changeSubject.asObservable();
  }


}
