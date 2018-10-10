import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChatingComponent } from './list-chating.component';

describe('ListChatingComponent', () => {
  let component: ListChatingComponent;
  let fixture: ComponentFixture<ListChatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
