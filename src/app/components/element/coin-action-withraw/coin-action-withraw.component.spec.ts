import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinActionWithrawComponent } from './coin-action-withraw.component';

describe('CoinActionWithrawComponent', () => {
  let component: CoinActionWithrawComponent;
  let fixture: ComponentFixture<CoinActionWithrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoinActionWithrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoinActionWithrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
