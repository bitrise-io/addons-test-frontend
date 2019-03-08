import { Component, Input } from '@angular/core';
import { TestCase, TestCaseStatus } from '../../models/test-case.model';

@Component({
  selector: 'bitrise-test-case',
  templateUrl: './test-case.component.html',
  styleUrls: ['./test-case.component.scss']
})
export class TestCaseComponent {
  @Input() testCase: TestCase;
  @Input() isNarrow = false;

  TestCaseStatus = TestCaseStatus;

  isSummaryVisible = false;
}
