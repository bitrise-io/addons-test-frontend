import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { WINDOW } from 'ngx-window-token';

import { AppResult } from 'src/app/services/backend/backend.model';
import { TestReport } from 'src/app/models/test-report.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { StartPollingReports } from 'src/app/store/reports/actions';
import { TestSuite } from 'src/app/models/test-suite.model';
import { Provider } from 'src/app/services/provider/provider.service';

@Component({
  selector: 'bitrise-test-suite-details',
  templateUrl: './test-suite-details.component.html',
  styleUrls: ['./test-suite-details.component.scss']
})
export class TestSuiteDetailsComponent implements OnInit, OnDestroy {
  appResult: AppResult;
  appResult$: Observable<AppResult>;
  buildSlug: string;
  testReports: TestReport[];
  testReports$: Observable<TestReport[]>;
  testSuites: TestSuite[];
  testReport: TestReport;
  testSuite: TestSuite;
  previousTestSuite: TestSuite;
  nextTestSuite: TestSuite;
  subscription = new Subscription();

  testSuiteDetailsMenuItems = [
    {
      name: 'Test Cases',
      subpath: 'testcases',
      availableProviders: [Provider.firebaseTestlab, Provider.jUnitXML],
      shouldSendAnalyticsEventOnSelection: false
    },
    {
      name: 'Performance',
      subpath: 'performance',
      availableProviders: [Provider.firebaseTestlab],
      shouldSendAnalyticsEventOnSelection: false
    },
    {
      name: 'Video',
      subpath: 'video',
      availableProviders: [Provider.firebaseTestlab],
      shouldSendAnalyticsEventOnSelection: false
    },
    {
      name: 'Screenshots',
      subpath: 'screenshots',
      availableProviders: [Provider.firebaseTestlab],
      shouldSendAnalyticsEventOnSelection: false
    },
    {
      name: 'Test Artifacts',
      subpath: 'testartifacts',
      availableProviders: [Provider.firebaseTestlab, Provider.jUnitXML],
      shouldSendAnalyticsEventOnSelection: true
    },
    {
      name: 'Logs',
      subpath: 'logs',
      availableProviders: [Provider.firebaseTestlab],
      shouldSendAnalyticsEventOnSelection: true
    }
  ];
  selectedTestSuiteDetailsMenuItem: {
    name: string;
    subpath: string;
  };

  constructor(
    @Inject(WINDOW) private window: Window,
    private router: Router,
    private store: Store<{ appResult: AppResult; testReport: TestReportState }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.appResult$ = store.select('app');
    this.testReports$ = store.select('testReport', 'testReports');

    this.subscription.add(
      this.activatedRoute.data.subscribe(
        (data: { testSuite: { buildSlug: string; selectedTestReport: TestReport; selectedTestSuite: TestSuite } }) => {
          this.buildSlug = data.testSuite.buildSlug;
          this.testReport = data.testSuite.selectedTestReport;
          this.testSuite = data.testSuite.selectedTestSuite;

          this.updateSelectedTestSuiteDetailsMenuItem();
        }
      )
    );
  }

  ngOnInit() {
    this.store.dispatch(new StartPollingReports({ buildSlug: this.buildSlug }));

    this.subscription.add(
      this.appResult$.subscribe((appResult: AppResult) => {
        this.appResult = appResult;
      })
    );

    this.subscription.add(
      this.testReports$.subscribe((testReports: TestReport[]) => {
        this.testReports = testReports;
        this.configureFromUrlParams();
      })
    );

    this.subscription.add(
      this.activatedRoute.params.subscribe((params: Params) => {
        this.configureFromUrlParams(params);
      })
    );

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.updateSelectedTestSuiteDetailsMenuItem();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  configureFromUrlParams(params = this.activatedRoute.snapshot.params) {
    this.testReport = this.testReports.find((testReport: TestReport) => testReport.id === params['testReportId']);

    if (!this.testReport) {
      // TODO 404?
      return;
    }

    this.testSuite = this.testReport.testSuites.find(
      (testSuite: TestSuite) => testSuite.id === Number(params['testSuiteId'])
    );

    const testSuiteIndex = this.testReport.testSuites.findIndex((testSuite) => testSuite === this.testSuite);
    this.previousTestSuite = testSuiteIndex > 0 ? this.testReport.testSuites[testSuiteIndex - 1] : null;
    this.nextTestSuite =
      testSuiteIndex < this.testReport.testSuites.length - 1 ? this.testReport.testSuites[testSuiteIndex + 1] : null;
  }

  updateSelectedTestSuiteDetailsMenuItem() {
    if (
      this.selectedTestSuiteDetailsMenuItem &&
      this.selectedTestSuiteDetailsMenuItem.subpath === this.activatedRoute.snapshot.firstChild.routeConfig.path
    ) {
      return;
    }

    this.selectedTestSuiteDetailsMenuItem = this.testSuiteDetailsMenuItems.find(
      (testSuiteDetailsMenuItem: any) =>
        testSuiteDetailsMenuItem.subpath === this.activatedRoute.snapshot.firstChild.routeConfig.path
    );
  }

  selectedTestSuiteDetailsMenuItemChanged(selectedTestSuiteDetailsMenuItem?) {
    if (!selectedTestSuiteDetailsMenuItem) {
      this.router.navigate([`./${this.selectedTestSuiteDetailsMenuItem.subpath}`], { relativeTo: this.activatedRoute });

      selectedTestSuiteDetailsMenuItem = this.selectedTestSuiteDetailsMenuItem;
    }

    if (selectedTestSuiteDetailsMenuItem.shouldSendAnalyticsEventOnSelection) {
      this.window.analytics.track('tabSelected', {
        addonId: 'addons-testing',
        appSlug: this.appResult.slug,
        appName: this.appResult.name,
        selectedTab: selectedTestSuiteDetailsMenuItem.subpath
      });
    }
  }
}
