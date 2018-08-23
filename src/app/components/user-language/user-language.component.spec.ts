import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLanguageComponent } from './user-language.component';

describe('UserLanguageComponent', () => {
  let component: UserLanguageComponent;
  let fixture: ComponentFixture<UserLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
