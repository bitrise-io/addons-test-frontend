import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { InlineSVGModule } from 'ng-inline-svg';

import { MockStore } from '../../store.mock';
import { TestSummaryComponent } from './test-summary.component';
import { TestReport } from '../../models/test-report.model';
import { testReportStoreReducer, TestReportStoreState } from '../test-report/test-report.store';

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
  let store: MockStore<TestReportStoreState>;
  let fixture: ComponentFixture<TestSummaryComponent>;
  let testSummary: TestSummaryComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ testReport: testReportStoreReducer }), InlineSVGModule.forRoot()],
      declarations: [TestSummaryComponent, MockTestSummaryHeaderComponent, MockTestReportComponent],
      providers: [{ provide: Store, useClass: MockStore }]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore<TestReportStoreState>) => {
    store = mockStore;
    store.setState({
      testReports: undefined,
      filteredReports: undefined,
      filter: null
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
        testReports: [],
        filter: null,
        filteredReports: Array(3)
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
