import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'gz-select-single',
  templateUrl: './select-single.component.html',
  styleUrls: ['./select-single.component.scss']
})
export class SelectSingleComponent implements OnInit {

  @Input()
  list: any[];

  @Input()
  active: any;

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


  constructor() {
  }

  ngOnInit() {
  }


  cancelSelect() {
    this.cancel.emit();
  }

  selectOne(data: any) {
    this.done.emit(data);
  }

  isActive(data) {
    if (this.keyField && data && this.active && data[this.keyField] === this.active[this.keyField]) {
      return 'active';
    }
    return '';
  }

}
