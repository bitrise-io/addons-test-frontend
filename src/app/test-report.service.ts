import { Injectable } from '@angular/core';
import { TestReport, TestReportResponse } from './test-report.model';
import { TestSuiteStatus } from './test-suite.model';
import { TestCaseStatus } from './test-case.model';

@Injectable()
export class TestReportService {
  private TEST_REPORTS = [
    {
      id: 1,
      name: 'Unit Test A',
      testSuites: [
        {
          status: TestSuiteStatus.passed,
          deviceName: 'iPhone 7',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 20000,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed }
          ],
          orientation: 'portrait',
          locale: 'English'
        },
        {
          status: TestSuiteStatus.passed,
          deviceName: 'iPhone 8',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 300,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed }
          ],
          orientation: 'portrait',
          locale: 'English'
        },
        {
          status: TestSuiteStatus.failed,
          deviceName: 'iPad Mini 2016',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 160000,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.failed }
          ],
          orientation: 'portrait',
          locale: 'Japanese'
        },
        {
          status: TestSuiteStatus.inconclusive,
          deviceName: 'Nexus7 clone, DVD 16:9 aspect ratio',
          deviceOperatingSystem: 'Android Oreo',
          durationInMilliseconds: 3700000,
          orientation: 'landscape',
          locale: 'Japanese'
        },
        {
          status: TestSuiteStatus.skipped,
          deviceName: 'iPhone 7',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 7200000,
          orientation: 'landscape',
          locale: 'Japanese'
        },
        {
          status: TestSuiteStatus.passed,
          deviceName: 'iPhone 7',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 5000,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed }
          ],
          orientation: 'portrait',
          locale: 'Japanese'
        },
        {
          status: TestSuiteStatus.failed,
          deviceName: 'iPhone 8',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 32000,
          testCases: [{ status: TestCaseStatus.passed }, { status: TestCaseStatus.failed }],
          orientation: 'portrait',
          locale: 'English'
        }
      ]
    },
    {
      id: 2,
      name: 'Unit Test X',
      testSuites: [
        {
          status: TestSuiteStatus.skipped,
          deviceName: 'iPhone 8',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 20,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed }
          ],
          orientation: 'portrait',
          locale: 'Traditional chinese'
        },
        {
          status: TestSuiteStatus.passed,
          deviceName: 'iPad Mini 2016',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 2000,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed }
          ],
          orientation: 'portrait',
          locale: 'Traditional chinese'
        },
        {
          status: TestSuiteStatus.failed,
          deviceName: 'iPad Mini 2017',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 120000,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.failed },
            { status: TestCaseStatus.failed }
          ],
          orientation: 'portrait',
          locale: 'English'
        }
      ]
    },
    {
      id: 3,
      name: 'Unit Test Y',
      testSuites: [
        {
          status: TestSuiteStatus.passed,
          deviceName: 'iPad Mini 2016',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 10,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed }
          ],
          orientation: 'portrait',
          locale: 'English'
        },
        {
          status: TestSuiteStatus.passed,
          deviceName: 'Galaxy S4 mini',
          deviceOperatingSystem: 'Android Ice Cream Sandwich',
          durationInMilliseconds: 1000,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed }
          ],
          orientation: 'portrait',
          locale: 'Japanese'
        },
        {
          status: TestSuiteStatus.failed,
          deviceName: 'iPhone 7',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 2050,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.failed },
            { status: TestCaseStatus.failed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.failed },
            { status: TestCaseStatus.failed }
          ],
          orientation: 'portrait',
          locale: 'English'
        },
        {
          status: TestSuiteStatus.inconclusive,
          deviceName: 'iPhone 7',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 20000,
          orientation: 'landscape',
          locale: 'English'
        }
      ]
    }
  ];

  getTestReports(): TestReport[] {
    return this.TEST_REPORTS.map((testReportResponse: TestReportResponse) =>
      new TestReport().deserialize(testReportResponse)
    );
  }
}
