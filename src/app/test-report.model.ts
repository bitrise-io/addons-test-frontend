import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { TestSuite, TestSuiteResponse } from './test-suite.model';

export interface TestReportResponse {
  id: number;
  name: string;
  testSuites: TestSuiteResponse[]
}

@Injectable()
export class TestReport implements Deserializable {
  id: number;
  name: string;
  testSuites: TestSuite[];

  deserialize(testReportResponse: TestReportResponse) {
    this.id = testReportResponse.id;
    this.name = testReportResponse.name;
    this.testSuites = testReportResponse.testSuites.map((testSuiteResponse: TestSuiteResponse) => new TestSuite().deserialize(testSuiteResponse));

    return this;
  }
}
