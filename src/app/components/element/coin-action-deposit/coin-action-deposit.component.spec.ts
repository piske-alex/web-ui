import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinActionDepositComponent } from './coin-action-deposit.component';

describe('CoinActionDepositComponent', () => {
  let component: CoinActionDepositComponent;
  let fixture: ComponentFixture<CoinActionDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinActionDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinActionDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
