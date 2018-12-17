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
  status: TestSuiteStatus;
  deviceName: string;
  deviceOperatingSystem: string;
  durationInMilliseconds: number;
  orientation: TestSuiteOrientation;
  locale: string;
  testCases: TestCaseResponse[];
};

@Injectable()
export class TestSuite implements Deserializable {
  status: TestSuiteStatus;
  deviceName: string;
  deviceOperatingSystem: string;
  durationInMilliseconds: number;
  orientation: TestSuiteOrientation;
  locale: string;
  testCases: TestCase[];

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
    this.status = testSuiteResponse.status;
    this.deviceName = testSuiteResponse.deviceName;
    this.deviceOperatingSystem = testSuiteResponse.deviceOperatingSystem;
    this.durationInMilliseconds = testSuiteResponse.durationInMilliseconds;
    this.testCases = testSuiteResponse.testCases
      ? testSuiteResponse.testCases.map((testCaseResponse: TestCaseResponse) =>
          new TestCase().deserialize(testCaseResponse)
        )
      : [];
    this.orientation = testSuiteResponse.orientation;
    this.locale = testSuiteResponse.locale;

    return this;
  }
}
