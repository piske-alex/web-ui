import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LanguageService } from "../../../providers/language/language.service";

@Component({
  selector: 'gz-select-ad-type',
  templateUrl: './select-ad-type.component.html',
  styleUrls: ['./select-ad-type.component.scss']
})
export class SelectAdTypeComponent implements OnInit {

  @Input()
  code: string;
  data: any;

  list: any[];

  isShowSelect: boolean;
  selectHead: string;
  selectKey: string = 'code';
  selectValue: string = 'name';

  @Output()
  private done = new EventEmitter();

  constructor(private languageService: LanguageService) {
  }

  async ngOnInit() {
    this.list = [
      {code: '1', name: await this.languageService.get('select.saleAd')},
      {code: '2', name: await this.languageService.get('select.buyAd')},
    ];

    this.list.forEach(_data => {
      if (_data.code === this.code) {
        this.data = _data;
        this.done.emit(_data);
      }
    });
  }

  async toSelect() {
    this.isShowSelect = true;
    this.selectHead = await this.languageService.get('select.adType');
  }

  selectCancel() {
    this.isShowSelect = false;
  }

  selectOne(data) {
    this.isShowSelect = false;
    if (data) {
      this.data = data;
      this.done.emit(data);
    }
  }

}
