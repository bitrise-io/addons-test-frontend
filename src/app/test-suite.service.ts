import { Injectable } from '@angular/core';

@Injectable()
export class TestSuiteService {
  private TEST_SUITES = [
    { id: 1, name: 'Unit Test A', failedTestCaseCount: 2 },
    { id: 2, name: 'Unit Test X', failedTestCaseCount: 0 },
    { id: 3, name: 'Unit Test Y', failedTestCaseCount: 1 }
  ];

  getTestSuites(): any[] {
    return this.TEST_SUITES;
  }
}
