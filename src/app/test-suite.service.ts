import { Injectable } from '@angular/core';

@Injectable()
export class TestSuiteService {
  private TEST_SUITES = [
    { id: 1, name: 'Unit Test A' },
    { id: 2, name: 'Unit Test X' },
    { id: 3, name: 'Unit Test Y' }
  ];

  getTestSuites() {
    return this.TEST_SUITES;
  }
}
