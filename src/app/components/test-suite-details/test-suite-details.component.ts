import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { TestReport, TestReportType } from 'src/app/models/test-report.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { FetchReports } from 'src/app/store/reports/actions';
import { TestSuite } from 'src/app/models/test-suite.model';
import { Provider } from 'src/app/services/provider/provider.service';

@Component({
  selector: 'bitrise-test-suite-details',
  templateUrl: './test-suite-details.component.html',
  styleUrls: ['./test-suite-details.component.scss']
})
export class TestSuiteDetailsComponent implements OnInit, OnDestroy {
  testReports: TestReport[];
  testReports$: Observable<TestReport[]>;
  testSuites: TestSuite[];
  testReport: TestReport;
  testSuite: TestSuite;
  previousTestSuite: TestSuite;
  nextTestSuite: TestSuite;
  testReportsSubscription: Subscription;
  activatedRouteParamsChangeSubscription: Subscription;

  testSuiteDetailsMenuItems = [
    {
      name: 'Test Cases',
      subpath: 'testcases',
      availableProviders: [Provider.firebaseTestlab, Provider.jUnitXML]
    },
    {
      name: 'Performance',
      subpath: 'performance',
      availableProviders: [Provider.firebaseTestlab]
    },
    {
      name: 'Video',
      subpath: 'video',
      availableProviders: [Provider.firebaseTestlab]
    },
    {
      name: 'Screenshots',
      subpath: 'screenshots',
      availableProviders: [Provider.firebaseTestlab]
    },
    {
      name: 'Test Artifacts',
      subpath: 'testartifacts',
      availableProviders: [Provider.firebaseTestlab, Provider.jUnitXML]
    },
    {
      name: 'Logs',
      subpath: 'logs',
      availableProviders: [Provider.firebaseTestlab]
    }
  ];
  selectedTestSuiteDetailsMenuItem: {
    name: string;
    subpath: string;
  };

  constructor(
    private router: Router,
    private store: Store<{ testReport: TestReportState }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.testReports$ = store.select('testReport', 'testReports');
  }

  ngOnInit() {
    this.selectedTestSuiteDetailsMenuItem = this.testSuiteDetailsMenuItems.find(
      (testSuiteDetailsMenuItem: any) =>
        testSuiteDetailsMenuItem.subpath === this.activatedRoute.firstChild.snapshot.routeConfig.path
    );

    this.store.dispatch(new FetchReports());

    this.testReportsSubscription = this.testReports$.subscribe((testReports: TestReport[]) => {
      this.testReports = testReports;
      this.configureFromUrlParams();
    });

    this.activatedRouteParamsChangeSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.configureFromUrlParams(params);
    });
  }

  ngOnDestroy() {
    this.testReportsSubscription.unsubscribe();
    this.activatedRouteParamsChangeSubscription.unsubscribe();
  }

  configureFromUrlParams(params = this.activatedRoute.snapshot.params) {
    this.testReport = this.testReports.find(
      (testReport: TestReport) => testReport.id === params['testReportId']
    );

    if (!this.testReport) {
      // TODO 404?
      return;
    }

    this.testSuite = this.testReport.testSuites.find(
      (testSuite: TestSuite) => testSuite.id === Number(params['testSuiteId'])
    );

    const testSuiteIndex = this.testReport.testSuites.findIndex(testSuite => testSuite === this.testSuite);
    this.previousTestSuite = testSuiteIndex > 0 ? this.testReport.testSuites[testSuiteIndex - 1] : null;
    this.nextTestSuite =
      testSuiteIndex < this.testReport.testSuites.length - 1
        ? this.testReport.testSuites[testSuiteIndex + 1]
        : null;
  }

  selectedTestSuiteDetailsMenuItemChanged() {
    this.router.navigate([`./${this.selectedTestSuiteDetailsMenuItem.subpath}`], { relativeTo: this.activatedRoute });
  }
}
