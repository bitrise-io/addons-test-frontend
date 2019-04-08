import { Component, OnInit } from '@angular/core';
import { Log } from 'src/app/models/log.model';
import { LogLine, LogLineType } from 'src/app/models/log-line.model';

const INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES = 20;

@Component({
  selector: 'bitrise-test-suite-details-menu-logs',
  templateUrl: './test-suite-details-menu-logs.component.html',
  styleUrls: ['./test-suite-details-menu-logs.component.scss']
})
export class TestSuiteDetailsMenuLogsComponent implements OnInit {
  downloadLogURL: string;

  typeFilterItems = [
    {
      name: 'All Logs',
      acceptedTypes: null
    },
    {
      name: 'Errors',
      acceptedTypes: [LogLineType.assert, LogLineType.error]
    },
    {
      name: 'Warnings',
      acceptedTypes: [LogLineType.warning]
    }
  ];
  selectedTypeFilterItem = this.typeFilterItems[0];
  maximumNumberOfVisibleLines: Number;
  INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES = INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES;

  log: Log;
  filteredLogLines: LogLine[];

  selectedTypeFilterItemChanged() {
    this.updateFilteredLogLines();
    this.resetMaximumNumberOfVisibleLines();
  }

  ngOnInit() {
    const logResponse = '';
    this.log = new Log().deserialize(logResponse);

    this.updateFilteredLogLines();
    this.resetMaximumNumberOfVisibleLines();
  }

  updateFilteredLogLines() {
    this.filteredLogLines = this.log.lines.filter(
      (logLine: LogLine) =>
        !this.selectedTypeFilterItem.acceptedTypes || this.selectedTypeFilterItem.acceptedTypes.includes(logLine.type)
    );
  }

  resetMaximumNumberOfVisibleLines() {
    this.maximumNumberOfVisibleLines = INITIAL_MAXIMUM_NUMBER_OF_VISIBLE_LINES;
  }
}
