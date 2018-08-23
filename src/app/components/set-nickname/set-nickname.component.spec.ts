import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetNicknameComponent } from './set-nickname.component';

describe('SetNicknameComponent', () => {
  let component: SetNicknameComponent;
  let fixture: ComponentFixture<SetNicknameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetNicknameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetNicknameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
