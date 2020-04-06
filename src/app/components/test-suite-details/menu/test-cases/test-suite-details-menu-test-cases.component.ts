import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { Subscription } from 'rxjs';

import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';

@Component({
  selector: 'bitrise-test-suite-details-menu-test-cases',
  templateUrl: './test-suite-details-menu-test-cases.component.html',
  styleUrls: ['./test-suite-details-menu-test-cases.component.scss']
})
export class TestSuiteDetailsMenuTestCasesComponent implements OnInit, OnDestroy {
  testReport: TestReport;
  testSuite: TestSuite;
  subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute) {}

  @ViewChild(VirtualScrollerComponent)
  private virtualScroller: VirtualScrollerComponent;

  updateListHeight(index: number) {
    this.virtualScroller.invalidateCachedMeasurementAtIndex(index);
  }

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
