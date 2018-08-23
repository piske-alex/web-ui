import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'gz-select-two',
  templateUrl: './select-two.component.html',
  styleUrls: ['./select-two.component.scss']
})
export class SelectTwoComponent implements OnInit {

  @Input()
  head: string;
  @Input()
  title1: string;
  @Input()
  title2: string;
  @Input()
  list1: string;
  @Input()
  list2: any[];
  @Input()
  keyField: string;
  @Input()
  valueField: string;

  @Input()
  code1: string | number;
  @Input()
  code2: string | number;

  time1: any;
  time2: any;

  @Output()
  private cancel = new EventEmitter();

  @Output()
  private done = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    if (!this.code1 && this.list1) {
      this.code1 = this.list1[0]
    }
    if (!this.code2 && this.list2) {
      this.code2 = this.list2[0]
    }

  }

  cancelSelect() {
    this.cancel.emit();
  }

  selectLeft(data) {
    this.code1 = data[this.keyField];
    this.time1 = data;
  }

  selectRight(data) {
    this.code2 = data[this.keyField];
    this.time2 = data;
  }

  isActiveLeft(data) {
    if (this.keyField && data && data[this.keyField] === this.code1) {
      return 'active';
    }
    return '';
  }

  isActiveRight(data) {
    if (this.keyField && data && data[this.keyField] === this.code2) {
      return 'active';
    }
    return '';
  }


  confirmSelect() {
    this.done.emit([this.time1, this.time2]);
  }

}
