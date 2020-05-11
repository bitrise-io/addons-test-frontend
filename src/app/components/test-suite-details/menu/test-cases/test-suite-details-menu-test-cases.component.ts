import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { Subscription, Observable, combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { TestSuite, TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestCase, TestCaseStatus } from 'src/app/models/test-case.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { ResetReportsFilter } from 'src/app/store/reports/actions';

@Component({
  selector: 'bitrise-test-suite-details-menu-test-cases',
  templateUrl: './test-suite-details-menu-test-cases.component.html',
  styleUrls: ['./test-suite-details-menu-test-cases.component.scss']
})
export class TestSuiteDetailsMenuTestCasesComponent implements OnInit, OnDestroy {
  testCases: TestCase[] = [];
  combinedSubscription: Subscription;
  filter$: Observable<TestSuiteStatus>;

  constructor(private activatedRoute: ActivatedRoute, private store: Store<{ testReport: TestReportState }>) {
    this.filter$ = store.select('testReport', 'filter');
  }

  @ViewChild(VirtualScrollerComponent)
  private virtualScroller: VirtualScrollerComponent;

  updateListHeight(index: number) {
    this.virtualScroller.invalidateCachedMeasurementAtIndex(index);
  }

  ngOnInit() {
    // Reset status filter to show all
    this.store.dispatch(ResetReportsFilter);

    this.combinedSubscription = combineLatest(
      this.activatedRoute.parent.data as Observable<{
        testSuite: { selectedTestSuite: TestSuite };
      }>,
      this.filter$
    )
      .pipe(
        map(
          ([
            {
              testSuite: {
                selectedTestSuite: { testCases }
              }
            },
            filter
          ]) => {
            this.testCases = testCases.filter(
              ({ status }) => filter === null || status === ((filter as unknown) as TestCaseStatus)
            );
          }
        )
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.combinedSubscription.unsubscribe();
  }
}
