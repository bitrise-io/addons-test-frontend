import { Component, OnInit } from '@angular/core';
import { TestReportService } from './test-report.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TestSuiteStatus } from './test-suite-status';
import { TestReport } from './test-report.model';
import { TestSuite } from './test-suite.model';

@Component({
  selector: 'bitrise-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  tabmenuItems: any[];
  selectedSmallTabmenuItem: any;
  summedFailedTestSuiteCount: number;

  constructor(private router: Router, private testReportService: TestReportService) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.selectedSmallTabmenuItem = this.tabmenuItems.find(({ routerLink: [url] }) => url === event.url);
    });
  }

  ngOnInit() {
    const testReports = this.testReportService.getTestReports();
    const failedTestSuiteCountsOfTestReports = testReports.map(
      testReport =>
        testReport.testSuites.filter((testSuite: TestSuite) => testSuite.status === TestSuiteStatus.failed).length
    );

    this.tabmenuItems = [
      {
        name: 'Test Summary',
        routerLink: ['/summary']
      }
    ].concat(
      testReports.map((testReport: TestReport, index: number) => ({
        name: testReport.name,
        routerLink: ['/testreport/' + testReport.id],
        failedTestSuiteCount: failedTestSuiteCountsOfTestReports[index]
      }))
    );

    this.summedFailedTestSuiteCount = failedTestSuiteCountsOfTestReports.reduce(
      (summedFailedTestSuiteCount: number, failedTestSuiteCountOfTestReport: number) =>
        summedFailedTestSuiteCount + failedTestSuiteCountOfTestReport,
      0
    );
  }

  selectedSmallTabmenuItemChanged() {
    this.router.navigate(this.selectedSmallTabmenuItem.routerLink);
  }
}
