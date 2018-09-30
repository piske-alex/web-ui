import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBComponent } from './transaction-b.component';

describe('TransactionBComponent', () => {
  let component: TransactionBComponent;
  let fixture: ComponentFixture<TransactionBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
