import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';

export enum TestSuiteStatus {
  inconclusive = 0,
  passed = 1,
  failed = 2,
  skipped = 3
}

export type TestSuiteResponse = {
  status: TestSuiteStatus
}

@Injectable()
export class TestSuite implements Deserializable {
  status: TestSuiteStatus;

  deserialize(testSuiteResponse: TestSuiteResponse) {
    this.status = testSuiteResponse.status;

    return this;
  }
}
