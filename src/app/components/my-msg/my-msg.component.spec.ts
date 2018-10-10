import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyMsgComponent } from './my-msg.component';

describe('MyMsgComponent', () => {
  let component: MyMsgComponent;
  let fixture: ComponentFixture<MyMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
