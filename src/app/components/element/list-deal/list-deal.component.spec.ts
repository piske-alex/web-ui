import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDealComponent } from './list-deal.component';

describe('ListDealComponent', () => {
  let component: ListDealComponent;
  let fixture: ComponentFixture<ListDealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
