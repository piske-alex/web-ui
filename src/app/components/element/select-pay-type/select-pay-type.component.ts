import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LanguageService } from '../../../providers/language/language.service';
import { CommonService } from '../../../providers/common/common.service';
import { Currency } from '../../../models/common/Currency';

@Component({
  selector: 'gz-select-pay-type',
  templateUrl: './select-pay-type.component.html',
  styleUrls: ['./select-pay-type.component.scss']
})
export class SelectPayTypeComponent implements OnInit {

  @Input()
  code: string;

  data: Currency[];

  list: Currency[];

  isShowSelect: boolean;
  selectHead: string;
  selectKey = 'code';
  selectValue = 'name';

  @Output()
  private done = new EventEmitter();

  constructor(private commonService: CommonService, private languageService: LanguageService) {
  }

  async ngOnInit() {
    try {
      this.list = await this.commonService.getPayTypeList();
    } catch (e) {
      console.error(e);
    }

    this.list = this.list || [];

    this._init();
  }

  private _init() {
    const _selectedCodes = this.code.split(',').map(_data => {
      return _data.trim();
    });
    this.data = [];
    this.list.forEach(_data => {
      if (_selectedCodes.includes(_data.code)) {
        this.data.push(_data);
      }
    });
    this.done.emit(this.data);
  }

  async toSelect() {
    this._init();
    this.isShowSelect = true;
    this.selectHead = await this.languageService.get('select.currency');
  }

  selectCancel() {
    this.isShowSelect = false;
  }

  selectMulti(data) {
    this.isShowSelect = false;
    if (data) {
      this.data = data;
      this.done.emit(data);
    }
  }
}
