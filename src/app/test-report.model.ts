import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';
import { TestSuite } from './test-suite.model';

@Injectable()
export class TestReport implements Deserializable {
  id: number;
  name: string;
  testSuites: TestSuite[];

  deserialize(testReportData: any) {
    this.id = testReportData.id;
    this.name = testReportData.name;
    this.testSuites = testReportData.testSuites.map((testSuiteData) => new TestSuite().deserialize(testSuiteData));

    return this;
  }
}
