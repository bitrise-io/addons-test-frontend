import { TestSuite, TestSuiteStatus } from './test-suite.model';

describe('TestSuite', () => {
  let testSuite: TestSuite;

  describe('class method statusName', () => {
    [
      { testSuiteStatus: TestSuiteStatus.inconclusive, expectedName: 'inconclusive' },
      { testSuiteStatus: TestSuiteStatus.passed, expectedName: 'passed' },
      { testSuiteStatus: TestSuiteStatus.failed, expectedName: 'failed' },
      { testSuiteStatus: TestSuiteStatus.skipped, expectedName: 'skipped' }
    ].forEach((specConfig: any) => {
      describe(`when providing status ${specConfig.testSuiteStatus}`, () => {
        it(`returns name ${specConfig.expectedName}`, () => {
          expect(TestSuite.statusName(specConfig.testSuiteStatus)).toBe(specConfig.expectedName);
        });
      });
    });
  });

  describe('class method statusCssClass', () => {
    [
      { testSuiteStatus: TestSuiteStatus.inconclusive, expectedCssClass: 'inconclusive' },
      { testSuiteStatus: TestSuiteStatus.passed, expectedCssClass: 'passed' },
      { testSuiteStatus: TestSuiteStatus.failed, expectedCssClass: 'failed' },
      { testSuiteStatus: TestSuiteStatus.skipped, expectedCssClass: 'skipped' }
    ].forEach((specConfig: any) => {
      describe(`when providing status ${specConfig.testSuiteStatus}`, () => {
        it(`returns CSS class ${specConfig.expectedCssClass}`, () => {
          expect(TestSuite.statusCssClass(specConfig.testSuiteStatus)).toBe(specConfig.expectedCssClass);
        });
      });
    });
  });

  describe('statusName', () => {
    beforeEach(() => {
      testSuite = new TestSuite();
    });

    [
      { testSuiteStatus: TestSuiteStatus.inconclusive, expectedName: 'inconclusive' },
      { testSuiteStatus: TestSuiteStatus.passed, expectedName: 'passed' },
      { testSuiteStatus: TestSuiteStatus.failed, expectedName: 'failed' },
      { testSuiteStatus: TestSuiteStatus.skipped, expectedName: 'skipped' }
    ].forEach((specConfig: any) => {
      describe(`when test suite has status ${specConfig.testSuiteStatus}`, () => {
        beforeEach(() => {
          testSuite.status = specConfig.testSuiteStatus;
        });

        it(`returns name ${specConfig.expectedName}`, () => {
          expect(testSuite.statusName).toBe(specConfig.expectedName);
        });
      });
    });
  });

  describe('statusCssClass', () => {
    beforeEach(() => {
      testSuite = new TestSuite();
    });

    [
      { testSuiteStatus: TestSuiteStatus.inconclusive, expectedCssClass: 'inconclusive' },
      { testSuiteStatus: TestSuiteStatus.passed, expectedCssClass: 'passed' },
      { testSuiteStatus: TestSuiteStatus.failed, expectedCssClass: 'failed' },
      { testSuiteStatus: TestSuiteStatus.skipped, expectedCssClass: 'skipped' }
    ].forEach((specConfig: any) => {
      describe(`when test suite has status ${specConfig.testSuiteStatus}`, () => {
        beforeEach(() => {
          testSuite.status = specConfig.testSuiteStatus;
        });

        it(`returns CSS class ${specConfig.expectedCssClass}`, () => {
          expect(testSuite.statusCssClass).toBe(specConfig.expectedCssClass);
        });
      });
    });
  });
});
