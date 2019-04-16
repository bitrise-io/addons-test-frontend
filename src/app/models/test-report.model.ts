import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { TestSuite, TestSuiteStatus, TestSuiteResponse } from './test-suite.model';

export enum TestReportType {
  uiTest = 'uiTest',
  unitTest = 'unitTest'
}

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

  get type(): TestReportType {
    if (this.testSuites.find((testSuite) => testSuite.deviceName !== undefined)) {
      return TestReportType.uiTest;
    }

    return TestReportType.unitTest;
  }

  get typeCssClass(): string {
    const typeCssClasses = {
      [TestReportType.uiTest]: 'ui-test',
      [TestReportType.unitTest]: 'unit-test'
    };

    return typeCssClasses[this.type];
  }

  testSuitesWithStatus(status: TestSuiteStatus) {
    return this.testSuites.filter((testSuite: TestSuite) => testSuite.status === status);
  }

  deserialize(testReportResponse: TestReportResponse) {
    this.id = testReportResponse.id;
    this.name = testReportResponse.name;

    if (testReportResponse.testSuites === undefined) {
      return this;
    }

    this.testSuites = testReportResponse.testSuites.map((testSuiteResponse: TestSuiteResponse) =>
      new TestSuite().deserialize(testSuiteResponse)
    );

    return this;
  }
}
