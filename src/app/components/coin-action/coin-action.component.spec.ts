import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinActionComponent } from './coin-action.component';

describe('CoinActionComponent', () => {
  let component: CoinActionComponent;
  let fixture: ComponentFixture<CoinActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
