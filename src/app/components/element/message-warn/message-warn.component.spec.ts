import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageWarnComponent } from './message-warn.component';

describe('MessageWarnComponent', () => {
  let component: MessageWarnComponent;
  let fixture: ComponentFixture<MessageWarnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageWarnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageWarnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
