import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { InlineSVGModule } from 'ng-inline-svg';

import { TestSummaryComponent } from './test-summary.component';
import { TestReport } from '../../models/test-report.model';
import { ReportsReducer, TestReportState } from 'src/app/store/reports/reducer';
import { provideMockStore, MockStore } from 'src/app/mock-store/testing';

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
  @Input() buildSlug: string;
  @Input() testReport: TestReport;
}

describe('TestSummaryComponent', () => {
  let store: MockStore<{ testReport: TestReportState }>;
  let fixture: ComponentFixture<TestSummaryComponent>;
  let testSummary: TestSummaryComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ testReport: ReportsReducer }), InlineSVGModule.forRoot()],
      declarations: [TestSummaryComponent, MockTestSummaryHeaderComponent, MockTestReportComponent],
      providers: [provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({buildSlug: 'build-slug'})
          }
        }]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
    store = mockStore;
    store.setState({
      testReport: {
        testReports: undefined,
        filteredReports: undefined,
        filter: null
      }
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
        testReport: {
          testReports: [],
          filter: null,
          filteredReports: Array(3)
            .fill(null)
            .map(() => new TestReport())
        }
      });

      fixture.detectChanges();
    });

    it('renders as many test report components as there are test reports', () => {
      expect(fixture.debugElement.queryAll(By.css('bitrise-test-report')).length).toBe(3);
    });
  });
});
