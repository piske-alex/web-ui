import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Country } from '../../../models/common/Country';
import { LanguageService } from '../../../providers/language/language.service';
import { CommonService } from '../../../providers/common/common.service';

@Component({
  selector: 'gz-select-country',
  templateUrl: './select-country.component.html',
  styleUrls: ['./select-country.component.scss']
})
export class SelectCountryComponent implements OnInit {

  @Input()
  code: string;

  data: Country;

  list: Country[];

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
      this.list = await this.commonService.getCountryList();
      for (const c of this.list) {
        c.name = await this.languageService.get('countryName.' + c.code);
      }
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

  async toSelectCountry() {
    this.isShowSelect = true;
    this.selectHead = await this.languageService.get('select.country');
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
