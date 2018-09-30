import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LanguageService } from '../../../providers/language/language.service';

@Component({
  selector: 'gz-select-during-time',
  templateUrl: './select-during-time.component.html',
  styleUrls: ['./select-during-time.component.scss']
})
export class SelectDuringTimeComponent implements OnInit {

  isShowSelect: boolean;

  @Input()
  openTimes: any[];
  everyDayDesc: Object;
  selectOpenTime: any;

  times: any[] = [];
  selectHead: string;
  startTitle: string;
  endTitle: string;
  startTimeCode: number;
  endTimeCode: number;

  i18ns: any = {};

  @Output()
  private done = new EventEmitter();

  private openTimeFail_1: string;

  constructor(private languageService: LanguageService) {
  }

  async ngOnInit() {

    this.selectHead = await this.languageService.get('otc.customOpenTime');
    this.startTitle = await this.languageService.get('common.start');
    this.endTitle = await this.languageService.get('common.end');

    this.openTimeFail_1 = await this.languageService.get('otc.openTimeFail_1');

    if (!this.openTimes) {
      this.openTimes = [
        {key: 'Sunday', start: '00:00', end: '23:59'},
        {key: 'Monday', start: '00:00', end: '23:59'},
        {key: 'Tuesday', start: '00:00', end: '23:59'},
        {key: 'Wednesday', start: '00:00', end: '23:59'},
        {key: 'Thursday', start: '00:00', end: '23:59'},
        {key: 'Friday', start: '00:00', end: '23:59'},
        {key: 'Saturday', start: '00:00', end: '23:59'},
      ];
    }

    this.everyDayDesc = {
      'Sunday': await this.languageService.get('common.every_sunday'),
      'Monday': await this.languageService.get('common.every_monday'),
      'Tuesday': await this.languageService.get('common.every_tuesday'),
      'Wednesday': await this.languageService.get('common.every_wednesday'),
      'Thursday': await this.languageService.get('common.every_thursday'),
      'Friday': await this.languageService.get('common.every_friday'),
      'Saturday': await this.languageService.get('common.every_saturday'),
    };

    for (let i = 0; i < 24; i++) {
      let _time;
      if (i < 10) {
        _time = `0${i}:00`;
      } else {
        _time = `${i}:00`;
      }
      this.times.push({code: i, name: _time});
    }

    this.times.push({code: 24, name: `23:59`});
    this.times.push({code: 25, name:  await this.languageService.get('common.close')});

    this.done.emit(this.openTimes);

  }

  toSelect(data) {
    this.selectOpenTime = data;
    this.updateSelectCode(data);
    this.isShowSelect = true;
  }

  selectCancel() {
    this.isShowSelect = false;
  }

  async selectOne(data) {
    if (data) {
      let _time1 = data[0];
      let _time2 = data[1];
      if (_time1.code < 25 && _time1.code > _time2.code) {
        return alert(this.openTimeFail_1);
      } else {
        this.selectOpenTime.start = _time1.name;
        this.selectOpenTime.end = _time2.name;
        this.done.emit(this.openTimes);
      }
    }
    this.isShowSelect = false;
  }

  private updateSelectCode(data) {
    this.times.forEach(_data => {
      if (_data.name === data.start) {
        this.startTimeCode = _data.code;
      }
      if (_data.name === data.end) {
        this.endTimeCode = _data.code;
      }
    });
  }


}
