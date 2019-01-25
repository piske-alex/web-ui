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

    //console.log(event)
    
    //event.currentTarget.disabled = true;
    //console.log(event.currentTarget , event.target)
    let target = event.currentTarget;
    //debugger
    let orignialClassName = target.className;
    target.className = orignialClassName +" btnUn";//"btnUnconfirmDiv";
    if(target.tagName.toLowerCase() == "button"){
      target.disabled = true;
      target.className = orignialClassName +" btnUn" ; //"btnUnconfirm";
    }
      
    this.clickSubject.next(event);
    setTimeout(() => {
      //event.currentTarget.disabled = false;
      target.className = orignialClassName;
      if(target.tagName.toLowerCase() == "button")
        target.disabled = false;
    }, this.timeOut);
  }

}
