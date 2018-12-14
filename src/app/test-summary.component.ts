import { Component, OnInit } from '@angular/core';
import { TestReportService } from './test-report.service';
import { TestReport } from './test-report.model';

@Component({
  selector: 'bitrise-test-summary',
  templateUrl: './test-summary.component.html',
  styleUrls: ['./test-summary.component.scss']
})
export class TestSummaryComponent implements OnInit {
  testReports: TestReport[];

  constructor(private testReportService: TestReportService) {}

  ngOnInit() {
    this.testReports = this.testReportService.getTestReports();
  }
}
