import { Component, Input } from '@angular/core';
import { TestReport, TestReportType } from './test-report.model';

@Component({
  selector: 'bitrise-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: ['./test-report.component.scss']
})
export class TestReportComponent {
  @Input() testReport: TestReport;

  TestReportType = TestReportType;
}
