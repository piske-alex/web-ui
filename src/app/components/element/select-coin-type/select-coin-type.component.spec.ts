import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCoinTypeComponent } from './select-coin-type.component';

describe('SelectCoinTypeComponent', () => {
  let component: SelectCoinTypeComponent;
  let fixture: ComponentFixture<SelectCoinTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCoinTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCoinTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
