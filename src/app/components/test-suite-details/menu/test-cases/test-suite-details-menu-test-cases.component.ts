import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { TestReport } from 'src/app/models/test-report.model';
import { TestReportStoreActionLoad } from 'src/app/components/test-report/test-report.store';
import { TestSuite } from 'src/app/models/test-suite.model';

@Component({
  selector: 'bitrise-test-suite-details-menu-test-cases',
  templateUrl: './test-suite-details-menu-test-cases.component.html',
  styleUrls: ['./test-suite-details-menu-test-cases.component.scss']
})
export class TestSuiteDetailsMenuTestCasesComponent implements OnInit {
  testReport: TestReport;
  testSuite: TestSuite;
  testReports$: Observable<TestReport[]>;

  constructor(private store: Store<{ testReport: TestReport[] }>, private activatedRoute: ActivatedRoute) {
    this.testReports$ = store.select('testReport');
  }

  ngOnInit() {
    this.store.dispatch(new TestReportStoreActionLoad());

    const routeParams = combineLatest(this.activatedRoute.pathFromRoot.map(t => t.params)).pipe(
      map(paramObjects => Object.assign({}, ...paramObjects))
    );

    combineLatest(routeParams, this.testReports$)
      .pipe(
        first(),
        map(([params, testReports]) => {
          const testReportId = Number(params.testReportId);
          const testSuiteId = Number(params.testSuiteId);

          const testReport: TestReport = testReports.find(({ id }: TestReport) => id === testReportId);
          this.testSuite = testReport.testSuites.find(({ id }: TestSuite) => id === testSuiteId);
        })
      )
      .subscribe();
  }
}
