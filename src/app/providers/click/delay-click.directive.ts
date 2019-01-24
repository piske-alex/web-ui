import { Directive , HostBinding, HostListener, Output, EventEmitter,OnInit, Input} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Directive({
  selector: '[gzDelayClick]'
})
export class DelayClickDirective {
  @Input() 
  debounceTime = 500;
  @Output() 
  debounceClick = new EventEmitter();
  @Input() 
  timeOut = 3000;
  @HostBinding('style.color') color: string;

  private clickSubject = new Subject();
  private subscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.subscription = this.clickSubject.pipe(debounceTime(this.debounceTime)).subscribe(e => {
      this.debounceClick.emit(e);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();

    event.target.disabled = true;
    let orignialClassName = event.target.className;
    event.target.className = "btnUnconfirm";

    this.clickSubject.next(event);
    setTimeout(() => {
      event.target.disabled = false;
      event.target.className = orignialClassName;
      console.log(event.target.className);
    }, this.timeOut);
  }

}
