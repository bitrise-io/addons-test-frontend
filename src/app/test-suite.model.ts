import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { TestSuiteOrientation } from './test-suite-orientation';
import { TestCase, TestCaseResponse } from './test-case.model';

export enum TestSuiteStatus {
  inconclusive = 0,
  passed = 1,
  failed = 2,
  skipped = 3
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

  get statusName() {
    return TestSuite.statusName(this.status);
  }

  get statusCssClass() {
    return TestSuite.statusCssClass(this.status);
  }

  deserialize(testSuiteResponse: any) {
    this.status = testSuiteResponse.status;
    this.deviceName = testSuiteResponse.deviceName;
    this.deviceOperatingSystem = testSuiteResponse.deviceOperatingSystem;
    this.durationInMilliseconds = testSuiteResponse.durationInMilliseconds;
    this.orientation = testSuiteResponse.orientation;
    this.locale = testSuiteResponse.locale;
    this.testCases = testSuiteResponse.testCases ? testSuiteResponse.testCases.map((testCaseResponse: TestCaseResponse) =>
      new TestCase().deserialize(testCaseResponse)
    ) : [];

    return this;
  }
}
