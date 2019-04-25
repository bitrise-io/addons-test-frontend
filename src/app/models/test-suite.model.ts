import { Injectable } from '@angular/core';
import { TestCase, TestCaseResponse } from './test-case.model';
import { TestArtifact } from './test-artifact.model';

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
  downloadAllScreenshotsURL?: string;
  outputUrls: {
    video: string;
    log: string[];
  };
};

export type TestSuiteScreenshot = {
  url: string;
  filename: string;
};

@Injectable()
export class TestSuite {
  id: number;
  status: TestSuiteStatus;
  deviceName: string;
  suiteName: string;
  deviceOperatingSystem: string;
  durationInMilliseconds: number;
  orientation: TestSuiteOrientation;
  locale: string;
  testCasesURL?: string;
  testCases: TestCase[];
  screenshots?: TestSuiteScreenshot[];
  artifacts?: TestArtifact[];
  downloadAllScreenshotsURL?: string;
  videoUrl: string;
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
}
