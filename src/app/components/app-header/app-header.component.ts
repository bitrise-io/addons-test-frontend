import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TestReport } from '../../models/test-report.model';
import { TestSuiteStatus, TestSuite } from '../../models/test-suite.model';
import { FilterReports, StartPollingReports } from 'src/app/store/reports/actions';
import { TestReportState } from 'src/app/store/reports/reducer';

@Component({
  selector: 'bitrise-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  buildSlug: string;
  TestSuite = TestSuite;
  testReports$: Observable<TestReport[]>;
  tabmenuItems: any[];
  selectedSmallTabmenuItem: any;
  summedFailedTestCount: number;
  _selectedStatus: TestSuiteStatus;

  get selectedStatus() {
    return this._selectedStatus;
  }
  set selectedStatus(status: TestSuiteStatus) {
    this._selectedStatus = status;
    this.store.dispatch(new FilterReports({ filter: status }));
  }

  statusMenuItems = [{ name: 'All', value: null, queryParam: null }].concat(
    [TestSuiteStatus.failed, TestSuiteStatus.passed, TestSuiteStatus.skipped, TestSuiteStatus.inconclusive].map(
      item => ({
        name: TestSuite.statusName(item).replace(/^./, x => x.toUpperCase()),
        value: item,
        queryParam: TestSuite.statusName(item)
      })
    )
  );

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private store: Store<{ testReport: TestReportState }>) {
    this.testReports$ = store.select('testReport', 'testReports');

    activatedRoute.queryParams.subscribe(params => {
      const statusMenuItemFromQueryParams = this.statusMenuItems.find(statusMenuItem => statusMenuItem.queryParam === params['status']);
      this.selectedStatus = statusMenuItemFromQueryParams ? statusMenuItemFromQueryParams.value : null;
    });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd || event instanceof RoutesRecognized)
    ).subscribe((event: NavigationEnd | RoutesRecognized) => {
      if (event instanceof NavigationEnd) {
        if (this.tabmenuItems !== undefined) {
          this.selectSmallTabmenuItemForUrl(event.url);
        }
      } else if (event instanceof RoutesRecognized) {
        if (event.state.root.firstChild) {
          this.buildSlug = event.state.root.firstChild.params.buildSlug;
          this.store.dispatch(new StartPollingReports({ buildSlug: this.buildSlug }));
        }
      }
    });

    this.testReports$.subscribe(testReports => {
      const failedTestCountsOfTestReports = testReports.map(
        testReport => testReport.testSuitesWithStatus(TestSuiteStatus.failed).length
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
    this.selectedSmallTabmenuItem = this.tabmenuItems.find(
      ({ routerLink: [tabmenuItemUrl] }) => url.startsWith(tabmenuItemUrl)
    );
  }

  selectedSmallTabmenuItemChanged() {
    this.router.navigate(this.selectedSmallTabmenuItem.routerLink, {queryParamsHandling: 'merge'});
  }

  selectedStatusChanged() {
    const selectedStatusMenuItem = this.statusMenuItems.find(statusMenuItem => statusMenuItem.value === this.selectedStatus);
    this.router.navigate([], {queryParams: {status: selectedStatusMenuItem.queryParam}});
  }
}
