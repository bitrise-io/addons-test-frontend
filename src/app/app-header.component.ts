import { Component, OnInit } from '@angular/core';
import { TestReportService } from './test-report.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TestReport } from './test-report.model';
import { TestSuiteStatus } from './test-suite.model';

@Component({
  selector: 'bitrise-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  tabmenuItems: any[];
  selectedSmallTabmenuItem: any;
  summedFailedTestCount: number;

  constructor(private router: Router, private testReportService: TestReportService) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.selectedSmallTabmenuItem = this.tabmenuItems.find(({ routerLink: [url] }) => url === event.url);
    });
  }

  ngOnInit() {
    const testReports = this.testReportService.getTestReports();
    const failedTestCountsOfTestReports = testReports.map(
      testReport => testReport.testsWithStatus(TestSuiteStatus.failed).length
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
        failedTestCount: failedTestCountsOfTestReports[index]
      }))
    );

    this.summedFailedTestCount = failedTestCountsOfTestReports.reduce(
      (summedFailedTestCount: number, failedTestCountOfTestReport: number) =>
        summedFailedTestCount + failedTestCountOfTestReport,
      0
    );
  }

  selectedSmallTabmenuItemChanged() {
    this.router.navigate(this.selectedSmallTabmenuItem.routerLink);
  }
}
