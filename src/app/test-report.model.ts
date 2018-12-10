import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';

@Injectable()
export class TestReport implements Deserializable {
  id: number;
  name: string;
  inconclusiveTestSuiteCount: number;
  passedTestSuiteCount: number;
  failedTestSuiteCount: number;
  skippedTestSuiteCount: number;

  deserialize(testReportData: any) {
    this.id = testReportData.id;
    this.name = testReportData.name;
    this.inconclusiveTestSuiteCount = testReportData.inconclusiveTestSuiteCount;
    this.passedTestSuiteCount = testReportData.passedTestSuiteCount;
    this.failedTestSuiteCount = testReportData.failedTestSuiteCount;
    this.skippedTestSuiteCount = testReportData.skippedTestSuiteCount;

    return this;
  }
}
