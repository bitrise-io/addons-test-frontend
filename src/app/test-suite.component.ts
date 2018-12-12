import { Component, Input } from '@angular/core';
import { TestSuite } from './test-suite.model';

@Component({
  selector: 'bitrise-test-suite',
  template: ''
})
export class TestSuiteComponent {
  @Input() testSuite: TestSuite;
}
