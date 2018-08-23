import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LanguageService } from "../../../providers/language/language.service";
import { Currency } from "../../../models/common/Currency";
import { CommonService } from "../../../providers/common/common.service";

@Component({
  selector: 'gz-select-currency',
  templateUrl: './select-currency.component.html',
  styleUrls: ['./select-currency.component.scss']
})
export class SelectCurrencyComponent implements OnInit {

  @Input()
  code: string;
  data: Currency;

  list: Currency[];

  isShowSelect: boolean;
  selectHead: string;
  selectKey: string = 'code';
  selectValue: string = 'name';

  @Output()
  private done = new EventEmitter();

  constructor(private commonService: CommonService, private languageService: LanguageService) {
  }

  async ngOnInit() {
    try {
      this.list = await this.commonService.getCurrencyList();
    } catch (e) {
      console.error(e);
    }

    this.list && this.list.forEach(_data => {
      if (_data.code === this.code) {
        this.data = _data;
        this.done.emit(_data);
      }
    });
  }

  async toSelect() {
    this.isShowSelect = true;
    this.selectHead = await this.languageService.get('select.currency');
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
