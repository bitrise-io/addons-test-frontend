import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { TestReport } from '../../models/test-report.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { StartPollingReports } from 'src/app/store/reports/actions';

@Component({
  selector: 'bitrise-test-summary',
  templateUrl: './test-summary.component.html',
  styleUrls: ['./test-summary.component.scss']
})
export class TestSummaryComponent implements OnInit {
  buildSlug: string;
  testReports: TestReport[];
  testReports$: Observable<TestReport[]>;
  loading$: Observable<boolean>;

  constructor(private activatedRoute: ActivatedRoute, private store: Store<{ testReport: TestReportState }>) {
    this.testReports$ = store.select('testReport', 'filteredReports');
    this.loading$ = store.select('testReport', 'isLoading');
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.buildSlug = params.buildSlug;

      this.store.dispatch(new StartPollingReports({ buildSlug: this.buildSlug }));
    });

    this.testReports$.subscribe((testReports: TestReport[]) => {
      this.testReports = testReports;
    });
  }
}
