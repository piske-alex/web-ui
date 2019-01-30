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
  timeOut = 3500;
  @HostBinding('style.color') color: string;

  private clickSubject = new Subject();
  private subscription: Subscription;

  private passiveTimeout : any;
  public timeoutSubject = new Subject();
  private interval:any;
  private ct:any;

  constructor() { }

  ngOnInit() {
    this.passiveTimeout = -2000;
    this.timeoutSubject.subscribe(v=>{
      this.passiveTimeout = v;
    })

    this.subscription = this.clickSubject.pipe(debounceTime(this.debounceTime)).subscribe(e => {
      this.debounceClick.emit(this.timeoutSubject);
    });


  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.timeoutSubject.unsubscribe();
    if(this.interval){
      clearInterval(this.interval);
    }
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
    
    let recoveryClass = ()=>{
        target.className = orignialClassName;
        if(target.tagName.toLowerCase() == "button")
          target.disabled = false;
    };

    this.clickSubject.next(event);
    this.interval = setInterval(()=>{
      if(this.passiveTimeout >0 ){
        recoveryClass();
        //console.log("interval",this.passiveTimeout,new Date().getMinutes(),new Date().getSeconds(),this.ct)
        clearInterval(this.interval);
        if(this.ct)
          clearTimeout(this.ct);
        this.passiveTimeout = -2;
      }
    },200)

    this.ct = setTimeout(() => {
      //console.log("time out start",this.passiveTimeout ,new Date().getMinutes(),new Date().getSeconds());
      //event.currentTarget.disabled = false;
      //if(this.passiveTimeout == -2 ){
      //  this.passiveTimeout = 2;
      //  return;
      //}
      if(this.interval)
          clearInterval(this.interval);
      //console.log("time out end",this.passiveTimeout,this.timeOut,new Date().getMinutes(),new Date().getSeconds())

      recoveryClass();

    }, this.timeOut);
  }

}
