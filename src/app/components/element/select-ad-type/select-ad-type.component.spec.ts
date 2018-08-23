import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAdTypeComponent } from './select-ad-type.component';

describe('SelectAdTypeComponent', () => {
  let component: SelectAdTypeComponent;
  let fixture: ComponentFixture<SelectAdTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAdTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAdTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
