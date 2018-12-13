import { Injectable } from '@angular/core';
import { TestReport } from './test-report.model';

@Injectable()
export class TestReportService {
  private TEST_REPORTS = [
    {
      id: 1,
      name: 'Unit Test A',
      testSuites: [
        { status: 1, deviceName: 'iPhone 7', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 20000},
        { status: 1, deviceName: 'iPhone 8', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 300},
        { status: 2, deviceName: 'iPad Mini 2016', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 160000},
        { status: 0, deviceName: 'iPad Mini 2017', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 3700000},
        { status: 3, deviceName: 'iPhone 7', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 7200000},
        { status: 1, deviceName: 'iPhone 7', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 5000},
        { status: 2, deviceName: 'iPhone 8', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 32000}
      ]
    },
    {
      id: 2,
      name: 'Unit Test X',
      testSuites: [
        { status: 3, deviceName: 'iPhone 8', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 20},
        { status: 1, deviceName: 'iPad Mini 2016', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 2000},
        { status: 2, deviceName: 'iPad Mini 2017', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 120000}
      ]
    },
    {
      id: 3,
      name: 'Unit Test Y',
      testSuites: [
        { status: 1, deviceName: 'iPad Mini 2016', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 10},
        { status: 1, deviceName: 'iPad Mini 2017', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 1000},
        { status: 2, deviceName: 'iPhone 7', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 2050},
        { status: 0, deviceName: 'iPhone 7', deviceOperatingSystem: 'iOS 11.2', durationInMilliseconds: 20000}
      ]
    }
  ];

  getTestReports(): TestReport[] {
    return this.TEST_REPORTS.map((testReportData: any) => new TestReport().deserialize(testReportData));
  }
}
