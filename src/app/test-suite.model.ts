import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';

@Injectable()
export class TestSuite implements Deserializable {
  id: number;
  name: string;
  failedTestCaseCount: number;

  deserialize(testSuiteData: any) {
    this.id = testSuiteData.id;
    this.name = testSuiteData.name;
    this.failedTestCaseCount = testSuiteData.failedTestCaseCount;

    return this;
  }
}
