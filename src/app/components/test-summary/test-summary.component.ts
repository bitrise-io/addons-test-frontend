import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TestReport } from '../../models/test-report.model';
import { TestReportStoreState } from 'src/app/store/reports/reducer';
import { FetchReports } from 'src/app/store/reports/actions';

@Component({
  selector: 'bitrise-test-summary',
  templateUrl: './test-summary.component.html',
  styleUrls: ['./test-summary.component.scss']
})
export class TestSummaryComponent implements OnInit {
  testReports: TestReport[];
  testReports$: Observable<TestReport[]>;

  constructor(private store: Store<{ testReport: TestReportStoreState }>) {
    this.testReports$ = store.select('testReport', 'filteredReports');
  }

  ngOnInit() {
    this.store.dispatch(new FetchReports());

    this.testReports$.subscribe((testReports: TestReport[]) => {
      this.testReports = testReports;
    });
  }
}
