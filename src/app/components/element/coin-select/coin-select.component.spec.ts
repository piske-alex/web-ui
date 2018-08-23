import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinSelectComponent } from './coin-select.component';

describe('CoinSelectComponent', () => {
  let component: CoinSelectComponent;
  let fixture: ComponentFixture<CoinSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
