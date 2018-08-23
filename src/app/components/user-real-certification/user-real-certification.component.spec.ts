import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRealCertificationComponent } from './user-real-certification.component';

describe('UserRealCertificationComponent', () => {
  let component: UserRealCertificationComponent;
  let fixture: ComponentFixture<UserRealCertificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRealCertificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRealCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
