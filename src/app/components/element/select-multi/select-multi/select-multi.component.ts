import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'gz-select-multi',
  templateUrl: './select-multi.component.html',
  styleUrls: ['./select-multi.component.scss']
})
export class SelectMultiComponent implements OnInit {
  @Input()
  list: any[];

  @Input()
  active: any[];

  @Input()
  head: string;

  @Input()
  keyField: string;

  @Input()
  valueField: string;

  @Output()
  private cancel = new EventEmitter();

  @Output()
  private done = new EventEmitter();

  // private selectDatas: any[];


  constructor() {
  }

  ngOnInit() {
    this.active = this.active || [];
  }


  cancelSelect() {
    this.cancel.emit();
  }

  selectOne(data: any) {
    let _existsIndex = -1;
    for (let i = 0; i < this.active.length; i++) {
      if (this.active[i][this.keyField] == data[this.keyField]) {
        _existsIndex = i;
        break;
      }
    }
    if (_existsIndex === -1) {
      this.active.push(data);
    } else {
      this.active.splice(_existsIndex, 1);
    }

  }

  confirmSelect() {
    this.done.emit(this.active);
  }

  isActive(data) {
    let _isActive = false;
    if (this.keyField && data && this.active) {
      for (let i = 0; i < this.active.length; i++) {
        if (data[this.keyField] === this.active[i][this.keyField]) {
          _isActive = true;
          break;
        }
      }
    }
    return _isActive ? 'active' : '';
  }
}
