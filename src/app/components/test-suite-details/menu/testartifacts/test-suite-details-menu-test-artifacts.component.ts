import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as kebabCase from 'lodash.kebabcase';

import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestArtifact } from 'src/app/models/test-artifact.model';
import { FetchArtifact } from 'src/app/store/artifacts/actions';
import { RemoteFile, ZipperService } from 'src/app/services/zipper.service';

@Component({
  selector: 'bitrise-test-suite-details-menu-test-artifacts',
  templateUrl: './test-suite-details-menu-test-artifacts.component.html',
  styleUrls: ['./test-suite-details-menu-test-artifacts.component.scss']
})
export class TestSuiteDetailsMenuTestArtifactsComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  testArtifacts: TestArtifact[];
  testArtifacts$: Observable<any>;
  generatingZip = false;
  suiteName: string;

  constructor(
    private store: Store<{
      testArtifact: {
        testArtifacts: TestArtifact[];
      };
    }>,
    private activatedRoute: ActivatedRoute,
    private zipper: ZipperService
  ) {
    this.testArtifacts$ = store.select('testArtifact');
  }

  ngOnInit() {
    this.subscription.add(
      this.activatedRoute.parent.data.subscribe(
        (data: { testSuite: { selectedTestReport: TestReport; selectedTestSuite: TestSuite } }) => {
          const testReport = data.testSuite.selectedTestReport;
          const testSuite = data.testSuite.selectedTestSuite;

          if (testSuite) {
            const { orientation, suiteName, deviceName, deviceOperatingSystem, locale } = testSuite;
            this.suiteName = suiteName || `${deviceName} ${deviceOperatingSystem} ${locale} ${orientation}`;
          }

          this.store.dispatch(new FetchArtifact({ testReport, testSuite }));
        }
      )
    );

    this.subscription.add(
      this.testArtifacts$.subscribe((testArtifactsData: any) => {
        this.testArtifacts = testArtifactsData.testArtifacts;
      })
    );
  }

  async downloadAll() {
    if (this.generatingZip || !this.testArtifacts) {
      return;
    }

    this.generatingZip = true;

    const files = this.testArtifacts.map(({ filename, downloadURL: url }) => <RemoteFile>{ filename, url });

    const zipName = `${kebabCase(this.suiteName)}-test-artifacts`;
    await this.zipper.zipFilesFromUrls(files, zipName);
    this.generatingZip = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
