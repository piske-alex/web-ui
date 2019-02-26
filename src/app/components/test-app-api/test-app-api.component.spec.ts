import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAppApiComponent } from './test-app-api.component';

describe('TestAppApiComponent', () => {
  let component: TestAppApiComponent;
  let fixture: ComponentFixture<TestAppApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestAppApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestAppApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
