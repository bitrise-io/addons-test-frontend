import { Pipe, PipeTransform } from '@angular/core';
import { TestSuiteStatus } from './test-suite-status';

@Pipe({ name: 'cssClassFromTestSuiteStatus' })
export class CssClassFromTestSuiteStatusPipe implements PipeTransform {
  transform(status: TestSuiteStatus): any {
    switch (status) {
    case TestSuiteStatus.inconclusive:
      return 'inconclusive';
    case TestSuiteStatus.passed:
      return 'passed';
    case TestSuiteStatus.failed:
      return 'failed';
    case TestSuiteStatus.skipped:
      return 'skipped';
    }
  }
}
