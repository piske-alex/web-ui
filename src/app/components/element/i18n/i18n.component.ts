import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from "../../../providers/language/language.service";

@Component({
  selector: 'gz-i18n',
  templateUrl: './i18n.component.html',
  styleUrls: ['./i18n.component.scss']
})
export class I18nComponent implements OnInit {

  value: Promise<string>;

  @Input()
  key: string;

  constructor(private languageService: LanguageService) {
  }

  ngOnInit() {
    if (this.languageService.isReady) {
      this.getI18n();
    } else {
      this.languageService.onReady().subscribe(isReady => {
        this.getI18n();
      });
    }
  }

  private getI18n() {
    this.value = this.languageService.get(this.key);
  }
}
