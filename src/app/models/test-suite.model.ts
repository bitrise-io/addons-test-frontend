import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { TestCase, TestCaseResponse } from './test-case.model';

export enum TestSuiteStatus {
  inconclusive = 0,
  passed = 1,
  failed = 2,
  skipped = 3
}

export enum TestSuiteOrientation {
  portrait = 'portrait',
  landscape = 'landscape'
}

export type TestSuiteResponse = {
  id: number;
  status: TestSuiteStatus;
  deviceName: string;
  suiteName: string;
  deviceOperatingSystem: string;
  durationInMilliseconds: number;
  orientation: TestSuiteOrientation;
  locale: string;
  testCases?: TestCaseResponse[];
  screenshots?: TestSuiteScreenshot[];
  downloadAllScreenshotsURL?: string,
  outputUrls: {
    log: string[]
  },
};

export type TestSuiteScreenshot = {
  url: string;
  filename: string;
};

@Injectable()
export class TestSuite implements Deserializable {
  id: number;
  status: TestSuiteStatus;
  deviceName: string;
  suiteName: string;
  deviceOperatingSystem: string;
  durationInMilliseconds: number;
  orientation: TestSuiteOrientation;
  locale: string;
  testCases: TestCase[];
  screenshots?: TestSuiteScreenshot[];
  downloadAllScreenshotsURL?: string;
  logUrl: string;

  public static statusName(status: TestSuiteStatus): string {
    const statusNames = {
      [TestSuiteStatus.inconclusive]: 'inconclusive',
      [TestSuiteStatus.passed]: 'passed',
      [TestSuiteStatus.failed]: 'failed',
      [TestSuiteStatus.skipped]: 'skipped'
    };

    return statusNames[status];
  }

  public static statusCssClass(status: TestSuiteStatus): string {
    const statusCssClasses = {
      [TestSuiteStatus.inconclusive]: 'inconclusive',
      [TestSuiteStatus.passed]: 'passed',
      [TestSuiteStatus.failed]: 'failed',
      [TestSuiteStatus.skipped]: 'skipped'
    };

    return statusCssClasses[status];
  }

  public static orientationCssClass(orientation: TestSuiteOrientation): string {
    const orientationCssClasses = {
      [TestSuiteOrientation.portrait]: 'portrait',
      [TestSuiteOrientation.landscape]: 'landscape'
    };

    return orientationCssClasses[orientation];
  }

  get statusName() {
    return TestSuite.statusName(this.status);
  }

  get statusCssClass() {
    return TestSuite.statusCssClass(this.status);
  }

  get orientationCssClass() {
    return TestSuite.orientationCssClass(this.orientation);
  }

  deserialize(testSuiteResponse: TestSuiteResponse) {
    this.id = testSuiteResponse.id;
    this.status = testSuiteResponse.status;
    this.deviceName = testSuiteResponse.deviceName;
    this.suiteName = testSuiteResponse.suiteName;
    this.deviceOperatingSystem = testSuiteResponse.deviceOperatingSystem;
    this.durationInMilliseconds = testSuiteResponse.durationInMilliseconds;
    this.testCases = testSuiteResponse.testCases
      ? testSuiteResponse.testCases.map((testCaseResponse: TestCaseResponse) =>
          new TestCase().deserialize(testCaseResponse)
        )
      : [];
    this.orientation = testSuiteResponse.orientation;
    this.locale = testSuiteResponse.locale;
    this.screenshots = testSuiteResponse.screenshots;
    this.downloadAllScreenshotsURL = testSuiteResponse.downloadAllScreenshotsURL;

    if (testSuiteResponse.outputUrls && testSuiteResponse.outputUrls.log && testSuiteResponse.outputUrls.log.length > 0) {
      this.logUrl = testSuiteResponse.outputUrls.log[0];
    }
    else {
      this.logUrl = null;
    }

    return this;
  }
}
