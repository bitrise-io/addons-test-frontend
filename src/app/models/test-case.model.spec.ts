import { TestCase, TestCaseStatus } from './test-case.model';

describe('TestCase', () => {
  let testCase: TestCase;

  describe('class method statusName', () => {
    [
      { testCaseStatus: TestCaseStatus.passed, expectedName: 'passed' },
      { testCaseStatus: TestCaseStatus.failed, expectedName: 'failed' }
    ].forEach((specConfig: any) => {
      describe(`when providing status ${specConfig.testCaseStatus}`, () => {
        it(`returns name ${specConfig.expectedName}`, () => {
          expect(TestCase.statusName(specConfig.testCaseStatus)).toBe(specConfig.expectedName);
        });
      });
    });
  });

  describe('class method statusCssClass', () => {
    [
      { testCaseStatus: TestCaseStatus.passed, expectedCssClass: 'passed' },
      { testCaseStatus: TestCaseStatus.failed, expectedCssClass: 'failed' }
    ].forEach((specConfig: any) => {
      describe(`when providing status ${specConfig.testCaseStatus}`, () => {
        it(`returns CSS class ${specConfig.expectedCssClass}`, () => {
          expect(TestCase.statusCssClass(specConfig.testCaseStatus)).toBe(specConfig.expectedCssClass);
        });
      });
    });
  });

  describe('statusName', () => {
    beforeEach(() => {
      testCase = new TestCase();
    });

    [
      { testCaseStatus: TestCaseStatus.passed, expectedName: 'passed' },
      { testCaseStatus: TestCaseStatus.failed, expectedName: 'failed' }
    ].forEach((specConfig: any) => {
      describe(`when test case has status ${specConfig.testCaseStatus}`, () => {
        beforeEach(() => {
          testCase.status = specConfig.testCaseStatus;
        });

        it(`returns name ${specConfig.expectedName}`, () => {
          expect(testCase.statusName).toBe(specConfig.expectedName);
        });
      });
    });
  });

  describe('statusCssClass', () => {
    beforeEach(() => {
      testCase = new TestCase();
    });

    [
      { testCaseStatus: TestCaseStatus.passed, expectedCssClass: 'passed' },
      { testCaseStatus: TestCaseStatus.failed, expectedCssClass: 'failed' }
    ].forEach((specConfig: any) => {
      describe(`when test case has status ${specConfig.testCaseStatus}`, () => {
        beforeEach(() => {
          testCase.status = specConfig.testCaseStatus;
        });

        it(`returns CSS class ${specConfig.expectedCssClass}`, () => {
          expect(testCase.statusCssClass).toBe(specConfig.expectedCssClass);
        });
      });
    });
  });
});
