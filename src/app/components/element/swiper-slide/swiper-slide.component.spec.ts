import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwiperSlideComponent } from './swiper-slide.component';

describe('SwiperSlideComponent', () => {
  let component: SwiperSlideComponent;
  let fixture: ComponentFixture<SwiperSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwiperSlideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwiperSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
