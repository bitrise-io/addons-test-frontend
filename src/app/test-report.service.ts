import { Injectable } from '@angular/core';
import { TestReport, TestReportResponse } from './test-report.model';
import { TestSuiteStatus, TestSuiteOrientation } from './test-suite.model';
import { TestCaseStatus } from './test-case.model';

@Injectable()
export class TestReportService {
  private TEST_REPORTS = [
    {
      id: 1,
      name: 'Unit Test A',
      testCases: [
        {
          name: 'testCaseExample1',
          status: TestCaseStatus.failed,
          durationInMilliseconds: 3000,
          context: 'ios_simple:dsfhkjshUITESTX',
          summary: `Nulla vitae elit libero, a pharetra augue. Sed posuere consectetur est at lobortis.

Nullam id dolor id nibh ultricies vehicula ut id elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.

Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec id elit non mi porta gravida at eget metus.`
        },
        {
          name: 'testCaseExample2',
          status: TestCaseStatus.passed,
          durationInMilliseconds: 5000,
          context: 'ios_complicated:abcdefgh',
          summary: 'Lorem ipsum'
        }
      ]
    },
    {
      id: 2,
      name: 'UI Test A',
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
          orientation: TestSuiteOrientation.portrait,
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
          orientation: TestSuiteOrientation.portrait,
          locale: 'Japanese'
        },
        {
          status: TestSuiteStatus.inconclusive,
          deviceName: 'Nexus7 clone, DVD 16:9 aspect ratio',
          deviceOperatingSystem: 'Android Oreo',
          durationInMilliseconds: 3700000,
          orientation: TestSuiteOrientation.landscape,
          locale: 'Traditional chinese'
        },
        {
          status: TestSuiteStatus.skipped,
          deviceName: 'iPhone 7',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 7200000,
          orientation: TestSuiteOrientation.landscape,
          locale: 'Japanese'
        }
      ]
    },
    {
      id: 3,
      name: 'UI Test B',
      testSuites: [
        {
          status: TestSuiteStatus.passed,
          deviceName: 'Galaxy S4 mini',
          deviceOperatingSystem: 'Android Ice Cream Sandwich',
          durationInMilliseconds: 10,
          testCases: [
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed },
            { status: TestCaseStatus.passed }
          ],
          orientation: TestSuiteOrientation.portrait,
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
          orientation: TestSuiteOrientation.portrait,
          locale: 'English'
        },
        {
          status: TestSuiteStatus.inconclusive,
          deviceName: 'iPhone 7',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 20000,
          orientation: TestSuiteOrientation.landscape,
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
