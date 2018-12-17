import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';

export enum TestCaseStatus {
  passed = 1,
  failed = 2
}

export type TestCaseResponse = {
  status: TestCaseStatus;
};

@Injectable()
export class TestCase implements Deserializable {
  status: TestCaseStatus;

  deserialize(testCaseData: any) {
    this.status = testCaseData.status;

    return this;
  }
}
