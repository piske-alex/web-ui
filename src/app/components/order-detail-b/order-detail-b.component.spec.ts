import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailBComponent } from './order-detail-b.component';

describe('OrderDetailBComponent', () => {
  let component: OrderDetailBComponent;
  let fixture: ComponentFixture<OrderDetailBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
