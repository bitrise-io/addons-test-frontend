import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { TestReportState } from 'src/app/store/reports/reducer';
import { TestSuite, TestSuiteStatus } from 'src/app/models/test-suite.model';
import { FilterReports } from 'src/app/store/reports/actions';

@Component({
  selector: 'bitrise-status-selector',
  templateUrl: './status-selector.component.html',
  styleUrls: ['./status-selector.component.scss']
})
export class StatusSelectorComponent {
  TestSuiteStatus = TestSuiteStatus;
  TestSuite = TestSuite;

  selected: TestSuiteStatus = null;

  statusMenuItems: Array<{ name: string; value: TestSuiteStatus }> = [{ name: 'All Statuses', value: null }].concat(
    [TestSuiteStatus.failed, TestSuiteStatus.passed, TestSuiteStatus.skipped, TestSuiteStatus.inconclusive].map(
      (item) => ({
        name: TestSuite.statusName(item).replace(/^./, (x) => x.toUpperCase()),
        value: item
      })
    )
  );

  onChange() {
    const selected = this.statusMenuItems.find(({ value }) => value === this.selected);
    this.store.dispatch(new FilterReports({ filter: selected.value }));
  }

  constructor(private store: Store<{ testReport: TestReportState }>) {
    store.select('testReport', 'filter').subscribe((selected) => {
      this.selected = selected;
    });
  }
}
