import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite, TestSuiteScreenshot } from 'src/app/models/test-suite.model';

@Component({
  selector: 'bitrise-test-suite-details-menu-screenshots',
  templateUrl: './test-suite-details-menu-screenshots.component.html',
  styleUrls: ['./test-suite-details-menu-screenshots.component.scss']
})
export class TestSuiteDetailsMenuScreenshotsComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  screenshots: TestSuiteScreenshot[];
  downloadAllScreenshotsURL: string;
  orientation: 'landscape' | 'portrait';

  get gridCssClass() {
    let cssClass = 'screenshots__grid';

    if (this.orientation) {
      cssClass += ` ${cssClass}--${this.orientation}`;
    }

    return cssClass;
  }

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.subscription.add(
      this.activatedRoute.parent.data.subscribe(
        (data: { testSuite: { selectedTestReport: TestReport; selectedTestSuite: TestSuite } }) => {
          const testSuite = data.testSuite.selectedTestSuite;

          if (testSuite) {
            this.screenshots = testSuite.screenshots;
            this.downloadAllScreenshotsURL = testSuite.downloadAllScreenshotsURL;
            this.orientation = testSuite.orientation;
          }

        }
      )
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
