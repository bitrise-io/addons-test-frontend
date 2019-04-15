import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Log } from 'src/app/models/log.model';
import { LogLine } from 'src/app/models/log-line.model';
import { LogLineLevel } from 'src/app/models/log-line-level.model';
import { FetchLog } from 'src/app/store/log/actions';

const INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES = 20;

@Component({
  selector: 'bitrise-test-suite-details-menu-logs',
  templateUrl: './test-suite-details-menu-logs.component.html',
  styleUrls: ['./test-suite-details-menu-logs.component.scss']
})
export class TestSuiteDetailsMenuLogsComponent implements OnInit {
  downloadLogURL: string;

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
    }>
  ) {
    this.log$ = store.select('log');
  }

  selectedLevelFilterItemChanged() {
    this.updateFilteredLogLines();
    this.resetMaximumNumberOfVisibleLines();
  }

  ngOnInit() {
    this.store.dispatch(new FetchLog());

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
        !this.selectedLevelFilterItem.acceptedLevels || this.selectedLevelFilterItem.acceptedLevels.includes(logLine.level)
    );
  }

  resetMaximumNumberOfVisibleLines() {
    this.maximumNumberOfVisibleLines = INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES;
  }
}
