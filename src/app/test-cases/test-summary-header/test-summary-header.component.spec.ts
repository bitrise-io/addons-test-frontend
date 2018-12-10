import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSummaryHeaderComponent } from './test-summary-header.component';

describe('TestSummaryHeaderComponent', () => {
  let component: TestSummaryHeaderComponent;
  let fixture: ComponentFixture<TestSummaryHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSummaryHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSummaryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
