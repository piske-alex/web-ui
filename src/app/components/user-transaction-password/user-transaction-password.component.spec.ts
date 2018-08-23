import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTransactionPasswordComponent } from './user-transaction-password.component';

describe('UserTransactionPasswordComponent', () => {
  let component: UserTransactionPasswordComponent;
  let fixture: ComponentFixture<UserTransactionPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTransactionPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTransactionPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
