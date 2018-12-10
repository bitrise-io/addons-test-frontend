import { Component, OnInit } from '@angular/core';
import { TestReportService } from './test-report.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'bitrise-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  tabmenuItems: any[];
  selectedSmallTabmenuItem: any;
  summedFailedTestCaseCount: number;

  constructor(private router: Router, private testReportService: TestReportService) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.selectedSmallTabmenuItem = this.tabmenuItems.find(({ routerLink: [url] }) => url === event.url);
    });
  }

  ngOnInit() {
    const testReports = this.testReportService.getTestReports();

    this.tabmenuItems = [
      {
        name: 'Test Summary',
        routerLink: ['/summary']
      }
    ].concat(
      testReports.map(testReport => ({
        name: testReport.name,
        routerLink: ['/testreport/' + testReport.id],
        failedTestCaseCount: testReport.failedTestCaseCount
      }))
    );

    this.summedFailedTestCaseCount = testReports.reduce(
      (summedFailedTestCaseCount, testReport: any) => summedFailedTestCaseCount + testReport.failedTestCaseCount,
      0
    );
  }

  selectedSmallTabmenuItemChanged() {
    this.router.navigate(this.selectedSmallTabmenuItem.routerLink);
  }
}
