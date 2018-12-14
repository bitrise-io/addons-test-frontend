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
    switch (status) {
      case TestSuiteStatus.inconclusive:
        return 'inconclusive';
      case TestSuiteStatus.passed:
        return 'passed';
      case TestSuiteStatus.failed:
        return 'failed';
      case TestSuiteStatus.skipped:
        return 'skipped';
    }
  }

  public static statusCssClass(status: TestSuiteStatus): string {
    switch (status) {
      case TestSuiteStatus.inconclusive:
        return 'inconclusive';
      case TestSuiteStatus.passed:
        return 'passed';
      case TestSuiteStatus.failed:
        return 'failed';
      case TestSuiteStatus.skipped:
        return 'skipped';
    }
  }

  public static orientationCssClass(orientation: TestSuiteOrientation): string {
    switch (orientation) {
      case TestSuiteOrientation.portrait:
        return 'portrait';
      case TestSuiteOrientation.landscape:
        return 'landscape';
    }
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

  deserialize(testSuiteResponse: any) {
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
