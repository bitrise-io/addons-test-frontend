import { Injectable } from '@angular/core';
import { Deserializable } from './deserializable.model';

@Injectable()
export class TestReport implements Deserializable {
  id: number;
  name: string;
  failedTestCaseCount: number;

  deserialize(testReportData: any) {
    this.id = testReportData.id;
    this.name = testReportData.name;
    this.failedTestCaseCount = testReportData.failedTestCaseCount;

    return this;
  }
}
