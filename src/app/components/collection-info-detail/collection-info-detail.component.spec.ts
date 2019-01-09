import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionInfoDetailComponent } from './collection-info-detail.component';

describe('CollectionInfoDetailComponent', () => {
  let component: CollectionInfoDetailComponent;
  let fixture: ComponentFixture<CollectionInfoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollectionInfoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionInfoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
