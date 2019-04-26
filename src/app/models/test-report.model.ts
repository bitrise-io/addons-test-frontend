import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { TestSuite, TestSuiteStatus } from './test-suite.model';
import { Provider } from '../services/provider/provider.service';

export enum TestReportType {
  uiTest = 'uiTest',
  unitTest = 'unitTest'
}

export type TestReportResponse = {
  id: string;
  name: string;
};

@Injectable()
export class TestReport implements Deserializable {
  id: string;
  name: string;
  type: TestReportType;
  provider: Provider;
  testSuites: TestSuite[];

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

    return this;
  }
}
