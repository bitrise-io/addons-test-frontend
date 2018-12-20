import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { TestReport } from './test-report.model';
import { TestReportStoreActionLoad } from './test-report.store';

@Component({
  selector: 'bitrise-test-summary',
  templateUrl: './test-summary.component.html',
  styleUrls: ['./test-summary.component.scss']
})
export class TestSummaryComponent implements OnInit {
  testReports: TestReport[];
  testReports$: Observable<TestReport[]>;

  constructor(
    private store: Store<{
      testReport: TestReport[];
    }>
  ) {
    this.testReports$ = store.pipe(select('testReport'));
  }

  ngOnInit() {
    this.store.dispatch(new TestReportStoreActionLoad());

    this.testReports$.subscribe((testReports: TestReport[]) => {
      this.testReports = testReports;
    });
  }
}
