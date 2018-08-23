import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPayTypeComponent } from './select-pay-type.component';

describe('SelectPayTypeComponent', () => {
  let component: SelectPayTypeComponent;
  let fixture: ComponentFixture<SelectPayTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPayTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPayTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
