import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { InlineSVGModule } from 'ng-inline-svg';

import { TestSummaryHeaderComponent } from './test-summary-header.component';
import { TestReport } from '../../models/test-report.model';
import { ReportsReducer, TestReportState } from 'src/app/store/reports/reducer';
import { TestSuite, TestSuiteStatus } from '../../models/test-suite.model';
import { MockStore, provideMockStore } from 'src/app/mock-store/testing';
import { StatusSelectorComponent } from '../status-selector/status-selector.component';
import { FormsModule } from '@angular/forms';

describe('TestSummaryHeaderComponent', () => {
  let store: MockStore<{ testReport: TestReportState }>;
  let fixture: ComponentFixture<TestSummaryHeaderComponent>;
  let testSummaryHeader: TestSummaryHeaderComponent;

  const testReportsFromSpecConfig = (specConfig: any) => {
    const testReport = new TestReport();
    testReport.id = specConfig.id;
    testReport.name = specConfig.name;
    const testSuiteStatuses = [
      TestSuiteStatus.inconclusive,
      TestSuiteStatus.passed,
      TestSuiteStatus.failed,
      TestSuiteStatus.skipped,
      TestSuiteStatus.inProgress
    ];

    testReport.testSuites = [
      specConfig.inconclusiveTestSuiteCount,
      specConfig.passedTestSuiteCount,
      specConfig.failedTestSuiteCount,
      specConfig.skippedTestSuiteCount,
      specConfig.inProgressTestSuiteCount
    ].reduce(
      (testSuites, testSuiteCount, index) =>
        testSuites.concat(
          Array(testSuiteCount)
            .fill(null)
            .map(() => {
              const testSuite = new TestSuite();
              testSuite.status = testSuiteStatuses[index];

              return testSuite;
            })
        ),
      []
    );

    return testReport;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ testReport: ReportsReducer }),
        InlineSVGModule.forRoot(),
        FormsModule
      ],
      declarations: [TestSummaryHeaderComponent, StatusSelectorComponent],
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
    store.setState({
      testReport: {
        testReports: [],
        filteredReports: [],
        filter: TestSuiteStatus.failed,
        isLoading: true
      }
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSummaryHeaderComponent);
    testSummaryHeader = fixture.debugElement.componentInstance;
  });

  it('creates the test summary header', () => {
    expect(testSummaryHeader).not.toBeNull();
  });

  describe('when there are some test reports', () => {
    beforeEach(() => {
      store.setState({
        testReport: {
          filteredReports: [],
          filter: null,
          isLoading: false,
          testReports: [
            {
              id: 1,
              name: 'UI Test A',
              inconclusiveTestSuiteCount: 5,
              passedTestSuiteCount: 3,
              failedTestSuiteCount: 2,
              skippedTestSuiteCount: 0,
              inProgressTestSuiteCount: 0
            },
            {
              id: 2,
              name: 'UI Test B',
              inconclusiveTestSuiteCount: 3,
              passedTestSuiteCount: 2,
              failedTestSuiteCount: 0,
              skippedTestSuiteCount: 1,
              inProgressTestSuiteCount: 0
            },
            {
              id: 3,
              name: 'UI Test C',
              inconclusiveTestSuiteCount: 7,
              passedTestSuiteCount: 4,
              failedTestSuiteCount: 1,
              skippedTestSuiteCount: 3,
              inProgressTestSuiteCount: 2
            },
            {
              id: 4,
              name: 'Unit Test X',
              inconclusiveTestSuiteCount: 0,
              passedTestSuiteCount: 2,
              failedTestSuiteCount: 3,
              skippedTestSuiteCount: 0,
              inProgressTestSuiteCount: 0
            },
            {
              id: 5,
              name: 'Unit Test Y',
              inconclusiveTestSuiteCount: 0,
              passedTestSuiteCount: 0,
              failedTestSuiteCount: 1,
              skippedTestSuiteCount: 0,
              inProgressTestSuiteCount: 0
            }
          ].map(testReportsFromSpecConfig)
        }
      });

      fixture.detectChanges();
    });

    it('shows the total number of tests in the total counter', () => {
      expect(
        fixture.debugElement.query(By.css('.test-counts .count-indicator.total .count')).nativeElement.textContent
      ).toBe('39');
    });

    [
      { statusName: 'failed', statusCssClass: 'failed', expectedCount: '7' },
      { statusName: 'passed', statusCssClass: 'passed', expectedCount: '11' },
      { statusName: 'skipped', statusCssClass: 'skipped', expectedCount: '4' },
      { statusName: 'inconclusive', statusCssClass: 'inconclusive', expectedCount: '15' }
    ].forEach((specConfig) => {
      it(`shows the number of ${specConfig.statusName} tests in the ${specConfig.statusName} counter`, () => {
        expect(
          fixture.debugElement.query(By.css(`.test-counts .count-indicator.${specConfig.statusCssClass} .count`))
            .nativeElement.textContent
        ).toBe(specConfig.expectedCount);
      });

      it(`shows a rate partition for ${specConfig.statusName} tests in the rate indicator`, () => {
        expect(
          fixture.debugElement.query(By.css(`.test-rates .status-rate.${specConfig.statusCssClass}`)).nativeElement
            .textContent
        ).toBe(`${specConfig.expectedCount} ${specConfig.statusName}`);
      });
    });

    it(`does not show the number of in progress tests`, () => {
      expect(fixture.debugElement.query(By.css(`.test-counts .count-indicator.in-progress .count`))).toBeNull();
    });

    it(`does not show a rate partition for in progress tests in the rate indicator`, () => {
      expect(fixture.debugElement.query(By.css(`.test-rates .status-rate.in-progress`))).toBeNull();
    });
  });

  describe('when there are no tests with a certain status', () => {
    beforeEach(() => {
      store.setState({
        testReport: {
          filteredReports: [],
          filter: null,
          isLoading: false,
          testReports: [
            {
              id: 1,
              name: 'UI Test A',
              inconclusiveTestSuiteCount: 5,
              passedTestSuiteCount: 3,
              failedTestSuiteCount: 2,
              skippedTestSuiteCount: 0
            },
            {
              id: 2,
              name: 'UI Test B',
              inconclusiveTestSuiteCount: 3,
              passedTestSuiteCount: 2,
              failedTestSuiteCount: 0,
              skippedTestSuiteCount: 0
            }
          ].map(testReportsFromSpecConfig)
        }
      });

      fixture.detectChanges();
    });

    it('hides the rate partition for that status in the rate indicator', () => {
      expect(
        fixture.debugElement
          .query(By.css('.test-rates .status-rate.skipped'))
          .nativeElement.attributes.getNamedItem('hidden').value
      ).toBe('');
    });

    it('does not hide the rate partition for other statuses in the rate indicator', () => {
      ['failed', 'passed', 'inconclusive'].forEach((statusCssClass) => {
        expect(
          fixture.debugElement
            .query(By.css(`.test-rates .status-rate.${statusCssClass}`))
            .nativeElement.attributes.getNamedItem('hidden')
        ).toBeNull();
      });
    });

    it('does not hide the counter of any statuses', () => {
      ['failed', 'passed', 'skipped', 'inconclusive'].forEach((statusCssClass) => {
        expect(
          fixture.debugElement
            .query(By.css(`.test-counts .count-indicator.${statusCssClass} .count`))
            .nativeElement.attributes.getNamedItem('hidden')
        ).toBeNull();
      });
    });

    it('shows 0 in the counter of that status', () => {
      expect(
        fixture.debugElement.query(By.css('.test-counts .count-indicator.skipped .count')).nativeElement.textContent
      ).toBe('0');
    });
  });
});
