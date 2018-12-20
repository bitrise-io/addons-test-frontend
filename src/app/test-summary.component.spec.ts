import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore } from './store.mock';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestSummaryComponent } from './test-summary.component';
import { TestReport } from './test-report.model';
import { testReportStoreReducer } from './test-report.store';

@Component({
  selector: 'bitrise-test-summary-header',
  template: ''
})
class MockTestSummaryHeaderComponent {}

@Component({
  selector: 'bitrise-test-report',
  template: ''
})
class MockTestReportComponent {
  @Input() testReport: TestReport;
}

describe('TestSummaryComponent', () => {
  let store: MockStore<{
    testReport: TestReport[];
  }>;
  let fixture: ComponentFixture<TestSummaryComponent>;
  let testSummary: TestSummaryComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ testReport: testReportStoreReducer }), InlineSVGModule.forRoot()],
      declarations: [TestSummaryComponent, MockTestSummaryHeaderComponent, MockTestReportComponent],
      providers: [{ provide: Store, useClass: MockStore }]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReport[] }>) => {
    store = mockStore;
    store.setState({
      testReport: undefined
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSummaryComponent);
    testSummary = fixture.debugElement.componentInstance;
  });

  it('creates the test summary', () => {
    expect(testSummary).not.toBeNull();
  });

  it('renders test summary header', () => {
    const testSummaryHeader = fixture.debugElement.query(By.css('bitrise-test-summary-header'));
    expect(testSummaryHeader).not.toBeNull();
  });

  describe('when there are some test reports', () => {
    beforeEach(() => {
      store.setState({
        testReport: Array(3)
          .fill(null)
          .map(() => new TestReport())
      });

      fixture.detectChanges();
    });

    it('renders as many test report components as there are test reports', () => {
      expect(fixture.debugElement.queryAll(By.css('bitrise-test-report')).length).toBe(3);
    });
  });
});
