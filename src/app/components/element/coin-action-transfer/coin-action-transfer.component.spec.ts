import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinActionTransferComponent } from './coin-action-transfer.component';

describe('CoinActionTransferComponent', () => {
  let component: CoinActionTransferComponent;
  let fixture: ComponentFixture<CoinActionTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinActionTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinActionTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
