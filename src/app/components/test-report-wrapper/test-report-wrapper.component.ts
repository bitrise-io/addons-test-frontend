import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { TestReport } from '../../models/test-report.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { FetchReports } from 'src/app/store/reports/actions';

@Component({
  selector: 'bitrise-test-report-wrapper',
  templateUrl: './test-report-wrapper.component.html',
  styleUrls: ['./test-report-wrapper.component.scss']
})
export class TestReportWrapperComponent implements OnInit, OnDestroy {
  testReports: TestReport[];
  testReports$: Observable<TestReport[]>;
  testReport: TestReport;
  combinedSubscription: Subscription;

  constructor(private store: Store<{ testReport: TestReportState }>, private activatedRoute: ActivatedRoute) {
    this.testReports$ = store.select('testReport', 'filteredReports');
  }

  ngOnInit() {
    this.store.dispatch(new FetchReports());

    this.combinedSubscription = combineLatest(this.activatedRoute.params, this.testReports$)
      .pipe(
        map(([params, reports]) => {
          this.testReport = reports.find((testReport: TestReport) => testReport.id === Number(params['testReportId']));
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.combinedSubscription.unsubscribe();
  }
}
