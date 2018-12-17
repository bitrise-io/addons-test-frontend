import { TestReport } from './test-report.model';
import { TestSuite, TestSuiteStatus } from './test-suite.model';
import { TestCase, TestCaseStatus } from './test-case.model';

describe('TestReport', () => {
  let testReport: TestReport;

  beforeEach(() => {
    testReport = new TestReport();
  });

  describe('testsWithStatus', () => {
    describe('when test report is a UI test report', () => {
      beforeEach(() => {
        testReport.testSuites = Array(6)
          .fill(null)
          .map(() => new TestSuite());
      });

      [TestSuiteStatus.inconclusive, TestSuiteStatus.passed, TestSuiteStatus.failed, TestSuiteStatus.skipped].forEach(
        (status: TestSuiteStatus) => {
          describe(`and some test suites have ${status} status`, () => {
            beforeEach(() => {
              testReport.testSuites[0].status = status;
              testReport.testSuites[1].status = status;
            });

            it('returns only those test suites', () => {
              expect(testReport.testsWithStatus(status)).toContain(testReport.testSuites[0]);
              expect(testReport.testsWithStatus(status)).toContain(testReport.testSuites[1]);
              expect(testReport.testsWithStatus(status)).not.toContain(testReport.testSuites[2]);
              expect(testReport.testsWithStatus(status)).not.toContain(testReport.testSuites[3]);
              expect(testReport.testsWithStatus(status)).not.toContain(testReport.testSuites[4]);
              expect(testReport.testsWithStatus(status)).not.toContain(testReport.testSuites[5]);
            });
          });
        }
      );
    });

    describe('when test report is a unit test report', () => {
      beforeEach(() => {
        testReport.testCases = Array(6)
          .fill(null)
          .map(() => new TestCase());
      });

      [TestCaseStatus.passed, TestCaseStatus.failed].forEach(
        (status: TestCaseStatus) => {
          describe(`and some test cases have ${status} status`, () => {
            beforeEach(() => {
              testReport.testCases[0].status = status;
              testReport.testCases[1].status = status;
            });

            it('returns only those test cases', () => {
              expect(testReport.testsWithStatus(status)).toContain(testReport.testCases[0]);
              expect(testReport.testsWithStatus(status)).toContain(testReport.testCases[1]);
              expect(testReport.testsWithStatus(status)).not.toContain(testReport.testCases[2]);
              expect(testReport.testsWithStatus(status)).not.toContain(testReport.testCases[3]);
              expect(testReport.testsWithStatus(status)).not.toContain(testReport.testCases[4]);
              expect(testReport.testsWithStatus(status)).not.toContain(testReport.testCases[5]);
            });
          });
        }
      );
    });
  });
});
