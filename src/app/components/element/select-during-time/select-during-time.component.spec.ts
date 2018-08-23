import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDuringTimeComponent } from './select-during-time.component';

describe('SelectDuringTimeComponent', () => {
  let component: SelectDuringTimeComponent;
  let fixture: ComponentFixture<SelectDuringTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDuringTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDuringTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
