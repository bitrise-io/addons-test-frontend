import { Component, Input } from '@angular/core';
import { TestSuite } from './test-suite.model';
import { TestSuiteStatus } from './test-suite-status';

@Component({
  selector: 'bitrise-test-suite',
  templateUrl: './test-suite.component.html',
  styleUrls: ['./test-suite.component.scss']
})
export class TestSuiteComponent {
  @Input() testSuite: TestSuite;

  testSuiteStatusEnum = TestSuiteStatus;
}
