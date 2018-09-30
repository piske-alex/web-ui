import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAdMyComponent } from './list-ad-my.component';

describe('ListAdMyComponent', () => {
  let component: ListAdMyComponent;
  let fixture: ComponentFixture<ListAdMyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAdMyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAdMyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
