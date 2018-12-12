import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { TestSuiteStatus } from './test-suite-status';

@Injectable()
export class TestSuite implements Deserializable {
  status: TestSuiteStatus;

  deserialize(testSuiteData: any) {
    this.status = testSuiteData.status;

    return this;
  }
}
