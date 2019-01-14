import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';

export enum TestCaseStatus {
  passed = 1,
  failed = 2
}

export type TestCaseResponse = {
  name: string;
  status: TestCaseStatus;
  durationInMilliseconds: number;
  context: string;
  summary: string;
};

@Injectable()
export class TestCase implements Deserializable {
  name: string;
  status: TestCaseStatus;
  durationInMilliseconds: number;
  context: string;
  summary: string;

  public static statusName(status: TestCaseStatus): string {
    switch (status) {
      case TestCaseStatus.passed:
        return 'passed';
      case TestCaseStatus.failed:
        return 'failed';
    }
  }

  public static statusCssClass(status: TestCaseStatus): string {
    switch (status) {
      case TestCaseStatus.passed:
        return 'passed';
      case TestCaseStatus.failed:
        return 'failed';
    }
  }

  get statusName() {
    return TestCase.statusName(this.status);
  }

  get statusCssClass() {
    return TestCase.statusCssClass(this.status);
  }

  deserialize(testCaseData: TestCaseResponse) {
    this.name = testCaseData.name;
    this.status = testCaseData.status;
    this.durationInMilliseconds = testCaseData.durationInMilliseconds;
    this.context = testCaseData.context;
    this.summary = testCaseData.summary;

    return this;
  }
}