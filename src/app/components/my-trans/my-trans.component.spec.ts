import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTransComponent } from './my-trans.component';

describe('MyTransComponent', () => {
  let component: MyTransComponent;
  let fixture: ComponentFixture<MyTransComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTransComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTransComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
