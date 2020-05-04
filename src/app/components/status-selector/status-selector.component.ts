import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TestSuite, TestSuiteStatus } from 'src/app/models/test-suite.model';

@Component({
  selector: 'bitrise-status-selector',
  templateUrl: './status-selector.component.html',
  styleUrls: ['./status-selector.component.scss']
})
export class StatusSelectorComponent {
  TestSuiteStatus = TestSuiteStatus;
  TestSuite = TestSuite;

  @Input('selectedStatus')
  selected: TestSuiteStatus;

  @Output()
  selectedChange = new EventEmitter<TestSuiteStatus>();

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
    this.selectedChange.emit(selected.value);
  }
}
