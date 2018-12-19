import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { TestReport } from './test-report.model';
import { TestSuiteStatus } from './test-suite.model';
import { TestReportStoreActionLoad } from './test-report.store';

@Component({
  selector: 'bitrise-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  testReports$: Observable<TestReport[]>;
  tabmenuItems: any[];
  selectedSmallTabmenuItem: any;
  summedFailedTestCount: number;

  constructor(
    private router: Router,
    private store: Store<{
      testReport: TestReport[];
    }>
  ) {
    this.testReports$ = store.pipe(select('testReport'));

    router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      if (this.tabmenuItems !== undefined) {
        this.selectSmallTabmenuItemForUrl(event.url);
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(new TestReportStoreActionLoad());

    this.testReports$.subscribe((testReports: TestReport[]) => {
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

      this.selectSmallTabmenuItemForUrl(this.router.url);
    });
  }

  selectSmallTabmenuItemForUrl(url: string) {
    this.selectedSmallTabmenuItem = this.tabmenuItems.find(
      ({ routerLink: [tabmenuItemUrl] }) => tabmenuItemUrl === url
    );
  }

  selectedSmallTabmenuItemChanged() {
    this.router.navigate(this.selectedSmallTabmenuItem.routerLink);
  }
}
