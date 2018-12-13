import { Injectable } from '@angular/core';
import { TestReport, TestReportResponse } from './test-report.model';
import { TestSuiteStatus } from './test-suite.model';

@Injectable()
export class TestReportService {
  private TEST_REPORTS = [
    {
      id: 1,
      name: 'Unit Test A',
      testSuites: [
        { status: TestSuiteStatus.passed, deviceName: 'iPhone 7', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 20000},
        { status: TestSuiteStatus.passed, deviceName: 'iPhone 8', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 300},
        { status: TestSuiteStatus.failed, deviceName: 'iPad Mini 2016', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 160000},
        { status: TestSuiteStatus.inconclusive, deviceName: 'iPad Mini 2017', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 3700000},
        { status: TestSuiteStatus.skipped, deviceName: 'iPhone 7', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 7200000},
        { status: TestSuiteStatus.passed, deviceName: 'iPhone 7', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 5000},
        { status: TestSuiteStatus.failed, deviceName: 'iPhone 8', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 32000}
      ]
    },
    {
      id: 2,
      name: 'Unit Test X',
      testSuites: [
        { status: TestSuiteStatus.skipped, deviceName: 'iPhone 8', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 20},
        { status: TestSuiteStatus.passed, deviceName: 'iPad Mini 2016', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 2000},
        { status: TestSuiteStatus.failed, deviceName: 'iPad Mini 2017', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 120000}
      ]
    },
    {
      id: 3,
      name: 'Unit Test Y',
      testSuites: [
        { status: TestSuiteStatus.passed, deviceName: 'iPad Mini 2016', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 10},
        { status: TestSuiteStatus.passed, deviceName: 'iPad Mini 2017', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 1000},
        { status: TestSuiteStatus.failed, deviceName: 'iPhone 7', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 2050},
        { status: TestSuiteStatus.inconclusive, deviceName: 'iPhone 7', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 20000}
      ]
    }
  ];

  getTestReports(): TestReport[] {
    return this.TEST_REPORTS.map((testReportResponse: TestReportResponse) => new TestReport().deserialize(testReportResponse));
  }
}
