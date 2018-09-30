import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTransationComponent } from './list-transation.component';

describe('ListTransationComponent', () => {
  let component: ListTransationComponent;
  let fixture: ComponentFixture<ListTransationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTransationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTransationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
