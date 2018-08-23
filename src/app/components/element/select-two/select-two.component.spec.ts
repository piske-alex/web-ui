import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTwoComponent } from './select-two.component';

describe('SelectTwoComponent', () => {
  let component: SelectTwoComponent;
  let fixture: ComponentFixture<SelectTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
