import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { TestSuite, TestSuiteStatus, TestSuiteResponse } from './test-suite.model';
import { TestCase, TestCaseResponse, TestCaseStatus } from './test-case.model';

export enum TestReportType {
  uiTest = 'uiTest',
  unitTest = 'unitTest'
}

export type TestReportResponse = {
  id: number;
  name: string;
  testSuites?: TestSuiteResponse[];
  testCases?: TestCaseResponse[];
};

@Injectable()
export class TestReport implements Deserializable {
  id: number;
  name: string;
  testSuites: TestSuite[];
  testCases: TestCase[];

  get type(): TestReportType {
    if (this.testSuites !== undefined) {
      return TestReportType.uiTest;
    }
    if (this.testCases !== undefined) {
      return TestReportType.unitTest;
    }
  }

  testsWithStatus(status: TestSuiteStatus | TestCaseStatus) {
    switch (this.type) {
      case TestReportType.uiTest:
        return this.testSuites.filter((testSuite: TestSuite) => Number(testSuite.status) === status);
      case TestReportType.unitTest:
        return this.testCases.filter((testCase: TestCase) => Number(testCase.status) === status);
    }
  }

  deserialize(testReportResponse: TestReportResponse) {
    this.id = testReportResponse.id;
    this.name = testReportResponse.name;

    if (testReportResponse.testSuites) {
      this.testSuites = testReportResponse.testSuites.map((testSuiteResponse: TestSuiteResponse) =>
        new TestSuite().deserialize(testSuiteResponse)
      );
    } else if (testReportResponse.testCases) {
      this.testCases = testReportResponse.testCases.map((testCaseResponse: TestCaseResponse) =>
        new TestCase().deserialize(testCaseResponse)
      );
    }

    return this;
  }
}
