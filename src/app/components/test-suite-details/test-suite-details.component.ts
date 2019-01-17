import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestReportStoreActionLoad } from '../test-report/test-report.store';

@Component({
  selector: 'bitrise-test-suite-details',
  templateUrl: './test-suite-details.component.html',
  styleUrls: ['./test-suite-details.component.scss']
})
export class TestSuiteDetailsComponent implements OnInit, OnDestroy {
  @Input() testSuite: TestSuite;

  testReports: TestReport[];
  testReports$: Observable<TestReport[]>;
  testSuites: TestSuite[];
  previousTestSuite: TestSuite;
  nextTestSuite: TestSuite;
  testReportsSubscription: Subscription;
  activatedRouteParamsChangeSubscription: Subscription;

  testSuiteDetailsMenuItems = [
    {
      name: 'Test Cases',
      subpath: 'testcases'
    },
    {
      name: 'Performance',
      subpath: 'performance'
    },
    {
      name: 'Video',
      subpath: 'video'
    },
    {
      name: 'Screenshots',
      subpath: 'screenshots'
    },
    {
      name: 'Test Artifacts',
      subpath: 'testartifacts'
    },
    {
      name: 'Logs',
      subpath: 'logs'
    }
  ];

  constructor(
    private store: Store<{
      testReport: TestReport[];
    }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.testReports$ = store.pipe(select('testReport'));
  }

  ngOnInit() {
    this.store.dispatch(new TestReportStoreActionLoad());

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
    const selectedTestReport = this.testReports.find(
      (testReport: TestReport) => testReport.id === Number(params['testReportId'])
    );

    this.testSuite = selectedTestReport.testSuites.find(
      (testSuite: TestSuite) => testSuite.id === Number(params['testSuiteId'])
    );

    const testSuiteIndex = selectedTestReport.testSuites.findIndex(testSuite => testSuite === this.testSuite);
    this.previousTestSuite = testSuiteIndex > 0 ? selectedTestReport.testSuites[testSuiteIndex - 1] : null;
    this.nextTestSuite =
      testSuiteIndex < selectedTestReport.testSuites.length - 1 ? selectedTestReport.testSuites[testSuiteIndex + 1] : null;
  }
}