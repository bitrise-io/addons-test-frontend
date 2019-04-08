import { Component, OnInit } from '@angular/core';
import { Log } from 'src/app/models/log.model';

@Component({
  selector: 'bitrise-test-suite-details-menu-logs',
  templateUrl: './test-suite-details-menu-logs.component.html',
  styleUrls: ['./test-suite-details-menu-logs.component.scss']
})
export class TestSuiteDetailsMenuLogsComponent implements OnInit {
  downloadLogURL: string;

  typeFilterItems = [{
    name: 'All Logs'
  }, {
    name: 'Errors'
  }, {
    name: 'Warnings'
  }];
  selectedTypeFilterItem = this.typeFilterItems[0];
  maximumNumberOfVisibleLines = 20;

  log: Log;

  selectedTypeFilterItemChanged() {

  }

  ngOnInit() {
  }
}
