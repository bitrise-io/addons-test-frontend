import { Component, OnInit, Output } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TestReport } from '../../models/test-report.model';
import { TestSuiteStatus, TestSuite } from '../../models/test-suite.model';
import { StartPollingReports } from 'src/app/store/reports/actions';
import { TestReportState } from 'src/app/store/reports/reducer';

export const HORIZONTAL_LAYOUT_REPORT_LIMIT = 5;

@Component({
  selector: 'bitrise-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  buildSlug: string;
  TestSuite = TestSuite;
  testReports$: Observable<TestReport[]>;
  testReports: TestReport[];
  tabmenuItems: any[];
  selectedSmallTabmenuItem: any;
  summedFailedTestCount: number;

  constructor(private router: Router, private store: Store<{ testReport: TestReportState }>) {
    this.testReports$ = store.select('testReport', 'testReports');
  }

  @Output() get isHorizontalLayout() {
    return this.testReports.length < HORIZONTAL_LAYOUT_REPORT_LIMIT;
  }

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd || event instanceof RoutesRecognized))
      .subscribe((event: NavigationEnd | RoutesRecognized) => {
        if (event instanceof NavigationEnd && this.tabmenuItems !== undefined) {
          this.selectSmallTabmenuItemForUrl(event.url);
        }
        if (event instanceof RoutesRecognized && event.state.root.firstChild) {
          this.buildSlug = event.state.root.firstChild.params.buildSlug;
          this.store.dispatch(new StartPollingReports({ buildSlug: this.buildSlug }));
        }
      });

    this.testReports$.subscribe((testReports) => {
      this.testReports = testReports;
      const failedTestCountsOfTestReports = testReports.map(
        (testReport) => testReport.testSuitesWithStatus(TestSuiteStatus.failed).length
      );

      this.tabmenuItems = [
        {
          name: 'Test Summary',
          routerLink: [`/builds/${this.buildSlug}/summary`]
        }
      ].concat(
        testReports.map((testReport: TestReport, index: number) => ({
          name: testReport.name,
          routerLink: [`/builds/${this.buildSlug}/testreport/` + testReport.id],
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
    this.selectedSmallTabmenuItem = this.tabmenuItems.find(({ routerLink: [tabmenuItemUrl] }) =>
      url.startsWith(tabmenuItemUrl)
    );
  }

  selectedSmallTabmenuItemChanged() {
    this.router.navigate(this.selectedSmallTabmenuItem.routerLink, { queryParamsHandling: 'merge' });
  }
}
