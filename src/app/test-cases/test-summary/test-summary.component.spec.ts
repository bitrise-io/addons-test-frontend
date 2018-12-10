import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSummaryComponent } from './test-summary.component';

describe('TestSummaryComponent', () => {
  let component: TestSummaryComponent;
  let fixture: ComponentFixture<TestSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
