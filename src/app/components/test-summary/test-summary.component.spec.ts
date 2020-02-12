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
import { initialState } from 'src/app/store/reports/reducer.spec';

@Component({
  selector: 'bitrise-test-summary-header',
  template: ''
})
class MockTestSummaryHeaderComponent {}

@Component({
  selector: 'bitrise-notification',
  template: ''
})
class MockNotificationComponent {}

@Component({
  selector: 'bitrise-test-report',
  template: ''
})
class MockTestReportComponent {
  @Input() buildSlug: string;
  @Input() testReport: TestReport;
}

@Component({
  selector: 'loader-circle',
  template: ''
})
class MockLoaderCircleComponent {
  @Input() show: boolean;
}

describe('TestSummaryComponent', () => {
  let store: MockStore<{ testReport: TestReportState }>;
  let fixture: ComponentFixture<TestSummaryComponent>;
  let testSummary: TestSummaryComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ testReport: ReportsReducer }), InlineSVGModule.forRoot()],
      declarations: [
        TestSummaryComponent,
        MockTestSummaryHeaderComponent,
        MockTestReportComponent,
        MockNotificationComponent,
        MockLoaderCircleComponent
      ],
      providers: [
        provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ buildSlug: 'build-slug' })
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
    store = mockStore;
    store.setState({ testReport: initialState });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSummaryComponent);
    testSummary = fixture.debugElement.componentInstance;
  });

  it('creates the test summary', () => {
    expect(testSummary).not.toBeNull();
  });

  describe('when there are some test reports', () => {
    beforeEach(() => {
      store.setState({
        testReport: {
          testReports: [],
          isLoading: false,
          filter: null,
          filteredReports: Array(3)
            .fill(null)
            .map(() => new TestReport())
        }
      });

      fixture.detectChanges();
    });

    it('renders test summary header', () => {
      const testSummaryHeader = fixture.debugElement.query(By.css('bitrise-test-summary-header'));
      expect(testSummaryHeader).not.toBeNull();
    });

    it('renders as many test report components as there are test reports', () => {
      expect(fixture.debugElement.queryAll(By.css('bitrise-test-report')).length).toBe(3);
    });

    it('does not render warning notification', () => {
      const warningNotification = fixture.debugElement.query(By.css('bitrise-notification'));
      expect(warningNotification).toBeNull();
    });
  });

  describe('when there are no test reports', () => {
    beforeEach(() => {
      store.setState({
        testReport: {
          testReports: [],
          isLoading: true,
          filter: null,
          filteredReports: []
        }
      });

      fixture.detectChanges();
    });

    it('does not render test summary header', () => {
      const testSummaryHeader = fixture.debugElement.query(By.css('bitrise-test-summary-header'));
      expect(testSummaryHeader).toBeNull();
    });

    it('does not render any test report components', () => {
      expect(fixture.debugElement.queryAll(By.css('bitrise-test-report')).length).toBe(0);
    });

    it('renders loader while loading test reports', () => {
      const loaderCircle = fixture.debugElement.query(By.css('loader-circle'));
      expect(loaderCircle).not.toBeNull();
    });

    it('renders warning notification', () => {
      store.setState({
        testReport: {
          testReports: [],
          isLoading: false,
          filter: null,
          filteredReports: []
        }
      });

      fixture.detectChanges();

      const loaderCircle = fixture.debugElement.query(By.css('.notification-wrapper'));
      expect(loaderCircle).not.toBeNull();
    });
  });
});
