import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LanguageService } from "../../../providers/language/language.service";
import { CoinType } from "../../../models/common/CoinType";
import { CommonService } from "../../../providers/common/common.service";

@Component({
  selector: 'gz-select-coin-type',
  templateUrl: './select-coin-type.component.html',
  styleUrls: ['./select-coin-type.component.scss']
})
export class SelectCoinTypeComponent implements OnInit {

  @Input()
  code: string;
  data: CoinType;

  list: CoinType[];

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
      this.list = await this.commonService.getCoinTypeList();
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
    this.selectHead = await this.languageService.get('select.coinType');
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
