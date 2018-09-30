import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdShowComponent } from './ad-show.component';

describe('AdShowComponent', () => {
  let component: AdShowComponent;
  let fixture: ComponentFixture<AdShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
