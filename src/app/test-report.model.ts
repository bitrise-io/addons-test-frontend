import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { TestSuite, TestSuiteStatus, TestSuiteResponse } from './test-suite.model';

export type TestReportResponse = {
  id: number;
  name: string;
  testSuites: TestSuiteResponse[];
};

@Injectable()
export class TestReport implements Deserializable {
  id: number;
  name: string;
  testSuites: TestSuite[];

  testSuitesWithStatus(status: TestSuiteStatus) {
    return this.testSuites.filter((testSuite: TestSuite) => testSuite.status === status);
  }

  deserialize(testReportResponse: TestReportResponse) {
    this.id = testReportResponse.id;
    this.name = testReportResponse.name;
    this.testSuites = testReportResponse.testSuites.map((testSuiteResponse: TestSuiteResponse) =>
      new TestSuite().deserialize(testSuiteResponse)
    );

    return this;
  }
}
