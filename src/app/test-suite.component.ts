import { Component, Input } from '@angular/core';
import { TestSuite, TestSuiteStatus } from './test-suite.model';

@Component({
  selector: 'bitrise-test-suite',
  templateUrl: './test-suite.component.html',
  styleUrls: ['./test-suite.component.scss']
})
export class TestSuiteComponent {
  @Input() testSuite: TestSuite;

  testSuiteStatusEnum = TestSuiteStatus;
}
