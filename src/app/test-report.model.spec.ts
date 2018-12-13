import { TestReport } from './test-report.model';
import { TestSuite, TestSuiteStatus } from './test-suite.model';

describe('TestReport', () => {
  let testReport: TestReport;

  beforeEach(() => {
    testReport = new TestReport();
  });

  describe('testSuitesWithStatus', () => {
    describe('when test report has some test suites', () => {
      beforeEach(() => {
        testReport.testSuites = Array(6)
          .fill(null)
          .map(() => new TestSuite());
      });

      [TestSuiteStatus.inconclusive, TestSuiteStatus.passed, TestSuiteStatus.failed, TestSuiteStatus.skipped].forEach(
        (status: TestSuiteStatus) => {
          describe(`and some test suites has ${status} status`, () => {
            beforeEach(() => {
              testReport.testSuites[0].status = status;
              testReport.testSuites[1].status = status;
            });

            it('returns only those test suites', () => {
              expect(testReport.testSuitesWithStatus(status)).toContain(testReport.testSuites[0]);
              expect(testReport.testSuitesWithStatus(status)).toContain(testReport.testSuites[1]);
              expect(testReport.testSuitesWithStatus(status)).not.toContain(testReport.testSuites[2]);
              expect(testReport.testSuitesWithStatus(status)).not.toContain(testReport.testSuites[3]);
              expect(testReport.testSuitesWithStatus(status)).not.toContain(testReport.testSuites[4]);
              expect(testReport.testSuitesWithStatus(status)).not.toContain(testReport.testSuites[5]);
            });
          });
        }
      );
    });
  });
});
