import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as kebabCase from 'lodash.kebabcase';

import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite, TestSuiteScreenshot } from 'src/app/models/test-suite.model';
import { ZipperService, RemoteFile } from 'src/app/services/zipper.service';

@Component({
  selector: 'bitrise-test-suite-details-menu-screenshots',
  templateUrl: './test-suite-details-menu-screenshots.component.html',
  styleUrls: ['./test-suite-details-menu-screenshots.component.scss']
})
export class TestSuiteDetailsMenuScreenshotsComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  screenshots: TestSuiteScreenshot[];
  orientation: 'landscape' | 'portrait';
  suiteName: string;
  generatingZip = false;

  get gridCssClass() {
    let cssClass = 'screenshots__grid';

    if (this.orientation) {
      cssClass += ` ${cssClass}--${this.orientation}`;
    }

    return cssClass;
  }

  constructor(private activatedRoute: ActivatedRoute, private zipper: ZipperService) {}

  ngOnInit() {
    this.subscription.add(
      this.activatedRoute.parent.data.subscribe(
        (data: { testSuite: { selectedTestReport: TestReport; selectedTestSuite: TestSuite } }) => {
          const testSuite = data.testSuite.selectedTestSuite;

          if (testSuite) {
            const { screenshots, orientation, suiteName, deviceName, deviceOperatingSystem, locale } = testSuite;

            this.screenshots = screenshots;
            this.orientation = orientation;

            this.suiteName = suiteName || `${deviceName} ${deviceOperatingSystem} ${locale} ${orientation}`;
          }
        }
      )
    );
  }

  async downloadAll() {
    if (this.generatingZip) {
      return;
    }

    this.generatingZip = true;

    const zipName = `${kebabCase(this.suiteName)}-screenshots`;
    await this.zipper.zipFilesFromUrls(<RemoteFile[]>this.screenshots, zipName);
    this.generatingZip = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
