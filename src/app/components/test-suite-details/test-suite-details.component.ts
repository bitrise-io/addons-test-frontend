import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class TestSuiteDetailsComponent implements OnInit {
  @Input() testSuite: TestSuite;

  testReports$: Observable<TestReport[]>;
  testReportsSubscription: Subscription;

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
      const testReport = testReports.find(
        (testReport: TestReport) => testReport.id === Number(this.activatedRoute.snapshot.params['testReportId'])
      );

      this.testSuite = testReport.testSuites.find(
        (testSuite: TestSuite) => testSuite.id === Number(this.activatedRoute.snapshot.params['testSuiteId'])
      )
    });
  }

  ngOnDestroy() {
    this.testReportsSubscription.unsubscribe();
  }
}
