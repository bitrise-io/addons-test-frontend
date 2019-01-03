import { TestSuite, TestSuiteStatus, TestSuiteOrientation } from './test-suite.model';

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

  describe('class method orientationCssClass', () => {
    [
      { testSuiteOrientation: TestSuiteOrientation.portrait, expectedCssClass: 'portrait' },
      { testSuiteOrientation: TestSuiteOrientation.landscape, expectedCssClass: 'landscape' },
    ].forEach((specConfig: any) => {
      describe(`when providing orientation ${specConfig.testSuiteOrientation}`, () => {
        it(`returns CSS class ${specConfig.expectedCssClass}`, () => {
          expect(TestSuite.orientationCssClass(specConfig.testSuiteOrientation)).toBe(specConfig.expectedCssClass);
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

  describe('orientationCssClass', () => {
    beforeEach(() => {
      testSuite = new TestSuite();
    });

    [
      { testSuiteOrientation: TestSuiteOrientation.portrait, expectedCssClass: 'portrait' },
      { testSuiteOrientation: TestSuiteOrientation.landscape, expectedCssClass: 'landscape' }
    ].forEach((specConfig: any) => {
      describe(`when test suite has orientation ${specConfig.testSuiteOrientation}`, () => {
        beforeEach(() => {
          testSuite.orientation = specConfig.testSuiteOrientation;
        });

        it(`returns CSS class ${specConfig.expectedCssClass}`, () => {
          expect(testSuite.orientationCssClass).toBe(specConfig.expectedCssClass);
        });
      });
    });
  });
});
