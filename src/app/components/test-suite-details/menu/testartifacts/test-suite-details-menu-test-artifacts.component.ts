import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestArtifact } from 'src/app/models/test-artifact.model';
import { FetchArtifact } from 'src/app/store/artifacts/actions';

@Component({
  selector: 'bitrise-test-suite-details-menu-test-artifacts',
  templateUrl: './test-suite-details-menu-test-artifacts.component.html',
  styleUrls: ['./test-suite-details-menu-test-artifacts.component.scss']
})
export class TestSuiteDetailsMenuTestArtifactsComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  downloadAllTestArtifactsURL: string;
  testArtifacts: TestArtifact[];
  testArtifacts$: Observable<any>;

  constructor(
    private store: Store<{
      testArtifact: {
        testArtifacts: TestArtifact[];
        downloadAllURL: string;
      };
    }>,
    private activatedRoute: ActivatedRoute
  ) {
    this.testArtifacts$ = store.select('testArtifact');
  }

  ngOnInit() {
    let testReport: TestReport;
    let testSuite: TestSuite;

    this.subscription.add(
      this.activatedRoute.parent.data.subscribe(
        (data: { testSuite: { selectedTestReport: TestReport; selectedTestSuite: TestSuite } }) => {
          testReport = data.testSuite.selectedTestReport;
          testSuite = data.testSuite.selectedTestSuite;

          if (testReport && testSuite) {
            this.store.dispatch(new FetchArtifact({ testReport: testReport, testSuite: testSuite }));
          }
        }
      )
    );

    this.subscription.add(
      this.testArtifacts$.subscribe((testArtifactsData: any) => {
        this.testArtifacts = testArtifactsData.testArtifacts;
        this.downloadAllTestArtifactsURL = testArtifactsData.downloadAllURL;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
