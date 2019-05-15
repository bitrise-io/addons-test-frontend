import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';

@Component({
  selector: 'bitrise-test-suite-details-menu-test-cases',
  templateUrl: './test-suite-details-menu-test-cases.component.html',
  styleUrls: []
})
export class TestSuiteDetailsMenuTestCasesComponent implements OnInit, OnDestroy {
  testReport: TestReport;
  testSuite: TestSuite;
  subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.subscription = this.activatedRoute.parent.data.subscribe(
      (data: { testSuite: { selectedTestReport: TestReport; selectedTestSuite: TestSuite } }) => {
        this.testReport = data.testSuite.selectedTestReport;
        this.testSuite = data.testSuite.selectedTestSuite;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
