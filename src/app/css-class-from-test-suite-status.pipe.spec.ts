import { CssClassFromTestSuiteStatusPipe } from './css-class-from-test-suite-status.pipe';
import { TestSuiteStatus } from './test-suite.model';

describe('CssClassFromTestSuiteStatusPipe', () => {
  let cssClassFromTestSuiteStatusPipe: CssClassFromTestSuiteStatusPipe;

  beforeEach(() => {
    cssClassFromTestSuiteStatusPipe = new CssClassFromTestSuiteStatusPipe();
  });

  [
    { testSuiteStatus: TestSuiteStatus.inconclusive, cssClass: 'inconclusive' },
    { testSuiteStatus: TestSuiteStatus.passed, cssClass: 'passed' },
    { testSuiteStatus: TestSuiteStatus.failed, cssClass: 'failed' },
    { testSuiteStatus: TestSuiteStatus.skipped, cssClass: 'skipped' }
  ].forEach((specConfig: any) => {
    describe(`when providing status ${specConfig.testSuiteStatus}`, () => {
      it(`returns CSS class ${specConfig.cssClass}`, () => {
        expect(cssClassFromTestSuiteStatusPipe.transform(specConfig.testSuiteStatus)).toBe(specConfig.cssClass);
      });
    });
  });
});
