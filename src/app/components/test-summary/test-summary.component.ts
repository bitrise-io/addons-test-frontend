import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TestReport } from '../../models/test-report.model';
import { TestReportStoreActionLoad, TestReportStoreState } from '../test-report/test-report.store';

@Component({
  selector: 'bitrise-test-summary',
  templateUrl: './test-summary.component.html',
  styleUrls: ['./test-summary.component.scss']
})
export class TestSummaryComponent implements OnInit {
  testReports: TestReport[];
  testReports$: Observable<TestReport[]>;

  constructor(private store: Store<TestReportStoreState>) {
    this.testReports$ = store.select('filteredReports');
  }

  ngOnInit() {
    this.store.dispatch(new TestReportStoreActionLoad());

    this.testReports$.subscribe((testReports: TestReport[]) => {
      this.testReports = testReports;
    });
  }
}
