import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestSummaryHeaderComponent } from './test-summary-header.component';
import { TestReportService } from './test-report.service';
import { TestReport } from './test-report.model';
import { TestSuite } from './test-suite.model';

class MockTestReportService {
  testReports: any[];

  public getTestReports(): any[] {
    return this.testReports;
  }
}

describe('TestSummaryHeaderComponent', () => {
  let service: MockTestReportService;
  let fixture: ComponentFixture<TestSummaryHeaderComponent>;
  let testSummaryHeader: TestSummaryHeaderComponent;

  const testReportsFromSpecConfig = (specConfig: any) => {
    const testReport = new TestReport();
    testReport.id = specConfig.id;
    testReport.name = specConfig.name;
    testReport.testSuites = [
      specConfig.inconclusiveTestSuiteCount,
      specConfig.passedTestSuiteCount,
      specConfig.failedTestSuiteCount,
      specConfig.skippedTestSuiteCount
    ].reduce(
      (testSuites, testSuiteCount, index) =>
        testSuites.concat(
          Array(testSuiteCount)
            .fill(null)
            .map(() => {
              const testSuite = new TestSuite();
              testSuite.status = index;

              return testSuite;
            })
        ),
      []
    );

    return testReport;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, InlineSVGModule.forRoot()],
      declarations: [TestSummaryHeaderComponent],
      providers: [{ provide: TestReportService, useClass: MockTestReportService }]
    }).compileComponents();

    service = TestBed.get(TestReportService);
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
      service.testReports = [
        {
          id: 1,
          name: 'Unit Test A',
          inconclusiveTestSuiteCount: 5,
          passedTestSuiteCount: 3,
          failedTestSuiteCount: 2,
          skippedTestSuiteCount: 0
        },
        {
          id: 2,
          name: 'Unit Test X',
          inconclusiveTestSuiteCount: 3,
          passedTestSuiteCount: 2,
          failedTestSuiteCount: 0,
          skippedTestSuiteCount: 1
        },
        {
          id: 3,
          name: 'Unit Test Y',
          inconclusiveTestSuiteCount: 7,
          passedTestSuiteCount: 4,
          failedTestSuiteCount: 1,
          skippedTestSuiteCount: 3
        }
      ].map(testReportsFromSpecConfig);

      fixture.detectChanges();
    });

    it('shows the total number of test suites in the total counter', () => {
      expect(
        fixture.debugElement.query(By.css('.test-counts .count-indicator.total .count')).nativeElement.textContent
      ).toBe('31');
    });

    [
      ['failed', 'failed', '3'],
      ['passed', 'passed', '9'],
      ['skipped', 'skipped', '4'],
      ['inconclusive', 'inconclusive', '15']
    ].forEach(specConfig => {
      const statusName = specConfig[0];
      const statusCssClass = specConfig[1];
      const count = specConfig[2];

      it(`shows the number of ${statusName} test suites in the ${statusName} counter`, () => {
        expect(
          fixture.debugElement.query(By.css(`.test-counts .count-indicator.${statusCssClass} .count`)).nativeElement
            .textContent
        ).toBe(count);
      });

      it(`shows a rate partition for ${statusName} test suites in the rate indicator`, () => {
        expect(
          fixture.debugElement.query(By.css(`.test-rates .rate-indicator.${statusCssClass}`)).nativeElement.textContent
        ).toBe(`${count} ${statusName}`);
      });
    });
  });

  describe('when there are no test suites with a certain status', () => {
    beforeEach(() => {
      service.testReports = [
        {
          id: 1,
          name: 'Unit Test A',
          inconclusiveTestSuiteCount: 5,
          passedTestSuiteCount: 3,
          failedTestSuiteCount: 2,
          skippedTestSuiteCount: 0
        },
        {
          id: 2,
          name: 'Unit Test X',
          inconclusiveTestSuiteCount: 3,
          passedTestSuiteCount: 2,
          failedTestSuiteCount: 0,
          skippedTestSuiteCount: 0
        }
      ].map(testReportsFromSpecConfig);

      fixture.detectChanges();
    });

    it('hides the rate partition for that status in the rate indicator', () => {
      expect(
        fixture.debugElement
          .query(By.css('.test-rates .rate-indicator.skipped'))
          .nativeElement.attributes.getNamedItem('hidden').value
      ).toBe('');
    });

    it('does not hide the rate partition for other statuses in the rate indicator', () => {
      ['failed', 'passed', 'inconclusive'].forEach(statusCssClass => {
        expect(
          fixture.debugElement
            .query(By.css(`.test-rates .rate-indicator.${statusCssClass}`))
            .nativeElement.attributes.getNamedItem('hidden')
        ).toBeNull();
      });
    });

    it('does not hide the counter of any statuses', () => {
      ['failed', 'passed', 'skipped', 'inconclusive'].forEach(statusCssClass => {
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
