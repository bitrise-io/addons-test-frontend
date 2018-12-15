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
          summary: `Nulla vitae elit libero, a pharetra augue. Sed posuere consectetur est at lobortis. Nullam id dolor id nibh ultricies vehicula ut id elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.

Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec id elit non mi porta gravida at eget metus. Vestibulum id ligula porta felis euismod semper. Aenean lacinia bibendum nulla sed consectetur.

Donec ullamcorper nulla non metus auctor fringilla. Aenean eu leo quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ligula porta felis euismod semper. Morbi leo risus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus muDuis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.`
        },
        {
          name: 'testCaseExample2',
          status: TestCaseStatus.failed,
          durationInMilliseconds: 5000,
          context: 'ios_complicated:abcdefgh',
          summary: 'Lorem ipsum'
        },
        {
          name: 'testCaseExample3',
          status: TestCaseStatus.passed,
          durationInMilliseconds: 18000,
          context: 'ios_simple:dsfhkjshUITESTX',
          summary: 'Lorem ipsum etc.'
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
          status: TestSuiteStatus.passed,
          deviceName: 'iPhone 8',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 300,
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
          locale: 'Japanese'
        },
        {
          status: TestSuiteStatus.skipped,
          deviceName: 'iPhone 7',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 7200000,
          orientation: TestSuiteOrientation.landscape,
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
          orientation: TestSuiteOrientation.portrait,
          locale: 'Japanese'
        },
        {
          status: TestSuiteStatus.failed,
          deviceName: 'iPhone 8',
          deviceOperatingSystem: 'iOS 11.2',
          durationInMilliseconds: 32000,
          testCases: [{ status: TestCaseStatus.passed }, { status: TestCaseStatus.failed }],
          orientation: TestSuiteOrientation.portrait,
          locale: 'English'
        }
      ]
    },
    {
      id: 3,
      name: 'UI Test B',
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
          orientation: TestSuiteOrientation.portrait,
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
          orientation: TestSuiteOrientation.portrait,
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
          orientation: TestSuiteOrientation.portrait,
          locale: 'English'
        }
      ]
    },
    {
      id: 4,
      name: 'UI Test C',
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
          orientation: TestSuiteOrientation.portrait,
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
