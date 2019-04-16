import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Log } from 'src/app/models/log.model';
import { LogLine } from 'src/app/models/log-line.model';
import { LogLineLevel } from 'src/app/models/log-line-level.model';
import { FetchLog } from 'src/app/store/log/actions';
import { TestReport } from 'src/app/models/test-report.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { FetchReports } from 'src/app/store/reports/actions';

const INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES = 20;

@Component({
  selector: 'bitrise-test-suite-details-menu-logs',
  templateUrl: './test-suite-details-menu-logs.component.html',
  styleUrls: ['./test-suite-details-menu-logs.component.scss']
})
export class TestSuiteDetailsMenuLogsComponent implements OnInit {
  testReports$: Observable<TestReport[]>;
  downloadLogURL: string;
  subscription: Subscription;

  levelFilterItems = [
    {
      name: 'All Logs',
      acceptedLevels: null
    },
    {
      name: 'Errors',
      acceptedLevels: [LogLineLevel.assert, LogLineLevel.error]
    },
    {
      name: 'Warnings',
      acceptedLevels: [LogLineLevel.warning]
    }
  ];
  selectedLevelFilterItem = this.levelFilterItems[0];
  maximumNumberOfVisibleLines: Number;
  INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES = INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES;

  log$: Observable<any>;
  log: Log;
  filteredLogLines: LogLine[];

  constructor(
    private store: Store<{
      log: {
        log: Log;
        downloadURL: string;
      };
      testReport: TestReportState;
    }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.testReports$ = store.select('testReport', 'testReports');
    this.log$ = store.select('log');
  }

  selectedLevelFilterItemChanged() {
    this.updateFilteredLogLines();
    this.resetMaximumNumberOfVisibleLines();
  }

  ngOnInit() {
    this.store.dispatch(new FetchReports());

    const routeParams = combineLatest(this.activatedRoute.pathFromRoot.map((t) => t.params)).pipe(
      map((paramObjects) => Object.assign({}, ...paramObjects))
    );
    let testReport: TestReport;

    this.subscription = combineLatest(routeParams, this.testReports$)
      .pipe(
        map(([params, testReports]) => {
          const testReportId = Number(params.testReportId);
          testReport = testReports.find(({ id }: TestReport) => id === testReportId);
        })
      )
      .subscribe(() => this.store.dispatch(new FetchLog(testReport)));

    this.log$.subscribe((logData: any) => {
      this.log = logData.log;
      this.downloadLogURL = logData.downloadURL;

      this.updateFilteredLogLines();
      this.resetMaximumNumberOfVisibleLines();
    });
  }

  updateFilteredLogLines() {
    this.filteredLogLines = this.log.lines.filter(
      (logLine: LogLine) =>
        !this.selectedLevelFilterItem.acceptedLevels ||
        this.selectedLevelFilterItem.acceptedLevels.includes(logLine.level)
    );
  }

  resetMaximumNumberOfVisibleLines() {
    this.maximumNumberOfVisibleLines = INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
