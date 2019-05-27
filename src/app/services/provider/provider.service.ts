import { Injectable } from '@angular/core';
import { TestReport, TestReportType } from 'src/app/models/test-report.model';
import { TestSuite, TestSuiteStatus, TestSuiteOrientation } from 'src/app/models/test-suite.model';
import { TestArtifact } from 'src/app/models/test-artifact.model';
import { TestCase, TestCaseStatus } from 'src/app/models/test-case.model';

export const PROVIDER_SERVICE = 'PROVIDER_SERVICE';

export enum Provider {
  firebaseTestlab = 'firebaseTestlab',
  jUnitXML = 'jUnitXML'
}

export type FirebaseTestlabTestReportDetailsResponse = FirebaseTestlabTestSuiteResponse[];
export type JUnitXMLTestReportDetailsResponse = {
  id: string;
  name: string;
  test_suites: JUnitXMLTestSuiteResponse[];
  test_assets: {
    filename: string;
    download_url: string;
  }[];
};

export type FirebaseTestlabTestSuiteResponse = {
  device_name: string;
  api_level: string;
  status: string;
  test_results?: [
    {
      total?: Number;
      failed?: Number;
    }
  ];
  outcome?: string;
  orientation: string;
  locale: string;
  step_id: string;
  output_urls: {
    video_url?: string;
    test_suite_xml_url?: string;
    log_urls?: string[];
    asset_urls?: {
      [filename: string]: string;
    };
    screenshot_urls?: string[];
  };
  test_type?: string;
  test_issues?: [
    {
      name: string;
    }
  ];
  step_duration_in_seconds?: Number;
};

export type FirebaseTestlabTestCasesResponse = string;

export type JUnitXMLTestSuiteResponse = {
  name: string;
  package: string;
  properties: {
    [property: string]: string;
  };
  tests: {
    name: string;
    classname: string;
    duration: Number;
    status: string;
    error: {
      message: string;
      body: string;
    };
  }[];
  totals: {
    tests: Number;
    passed: Number;
    skipped: Number;
    failed: Number;
    error: Number;
    duration: Number;
  };
};

export type JUnitXMLTestCaseResponse = {
  name: string;
  classname: string;
  duration: Number;
  status: string;
  error?: {
    message?: string;
    body: string;
  };
};

@Injectable()
export class ProviderService {
  detectProvider(
    testReportDetailsResponse: FirebaseTestlabTestReportDetailsResponse | JUnitXMLTestReportDetailsResponse
  ): Provider {
    if (testReportDetailsResponse instanceof Array) {
      return Provider.firebaseTestlab;
    }

    return Provider.jUnitXML;
  }

  deserializeTestReportDetails(
    testReportDetailsResponse: FirebaseTestlabTestReportDetailsResponse | JUnitXMLTestReportDetailsResponse,
    testReport: TestReport
  ) {
    switch (this.detectProvider(testReportDetailsResponse)) {
      case Provider.firebaseTestlab: {
        return this.deserializeFirebaseTestlabTestReportDetails(
          <FirebaseTestlabTestReportDetailsResponse>testReportDetailsResponse,
          testReport
        );
      }
      case Provider.jUnitXML: {
        return this.deserializeJUnitXMLTestReportDetails(
          <JUnitXMLTestReportDetailsResponse>testReportDetailsResponse,
          testReport
        );
      }
    }
  }

  deserializeFirebaseTestlabTestReportDetails(
    testReportDetailsResponse: FirebaseTestlabTestReportDetailsResponse,
    testReport: TestReport
  ) {
    testReport.type = TestReportType.uiTest;
    testReport.provider = Provider.firebaseTestlab;

    testReport.testSuites = testReportDetailsResponse.map(
      (testSuiteResponse: FirebaseTestlabTestSuiteResponse, index: number) => {
        const testSuite = this.deserializeFirebaseTestlabTestSuite(testSuiteResponse);
        testSuite.id = index;

        return testSuite;
      }
    );

    return testReport;
  }

  deserializeFirebaseTestlabTestSuite(testSuiteResponse: FirebaseTestlabTestSuiteResponse) {
    const testSuite = new TestSuite();
    testSuite.deviceName = testSuiteResponse.device_name;
    testSuite.suiteName = null;
    testSuite.deviceOperatingSystem = testSuiteResponse.api_level;
    testSuite.orientation = TestSuiteOrientation[testSuiteResponse.orientation];
    testSuite.locale = testSuiteResponse.locale;
    testSuite.stepID = testSuiteResponse.step_id;

    switch (testSuiteResponse.status) {
      case 'pending':
      case 'inProgress':
        testSuite.status = TestSuiteStatus.inProgress;
        testSuite.durationInMilliseconds = null;

        break;
      case 'complete':
        if (testSuiteResponse.outcome === 'inconclusive') {
          testSuite.status = TestSuiteStatus.inconclusive;
        } else if (testSuiteResponse.outcome === 'skipped') {
          testSuite.status = TestSuiteStatus.skipped;
        } else if (testSuiteResponse.outcome === 'failure') {
          testSuite.status = TestSuiteStatus.failed;
        } else {
          testSuite.status = TestSuiteStatus.passed;
        }

        testSuite.durationInMilliseconds = 1000 * Number(testSuiteResponse.step_duration_in_seconds);

        testSuite.screenshots = [];
        if (testSuiteResponse.output_urls.screenshot_urls) {
          testSuite.screenshots = testSuiteResponse.output_urls.screenshot_urls.map((screenshotURL) => {
            const filenameRegExp = /^.+\/([^?\n]*).*$/;

            return {
              url: screenshotURL,
              filename: filenameRegExp.test(screenshotURL) ? filenameRegExp.exec(screenshotURL)[1] : null
            };
          });
        }

        testSuite.testCasesURL = testSuiteResponse.output_urls.test_suite_xml_url;
        testSuite.artifacts = Object.entries(testSuiteResponse.output_urls.asset_urls).map(
          ([artifactFilename, artifactURL]) => {
            const testArtifact = new TestArtifact();
            testArtifact.downloadURL = artifactURL;
            testArtifact.filename = artifactFilename;

            return testArtifact;
          }
        );
        testSuite.videoUrl = testSuiteResponse.output_urls.video_url;
        testSuite.logUrl = testSuiteResponse.output_urls.log_urls[0];
    }

    return testSuite;
  }

  deserializeJUnitXMLTestReportDetails(
    testReportDetailsResponse: JUnitXMLTestReportDetailsResponse,
    testReport: TestReport
  ) {
    testReport.type = TestReportType.unitTest;
    testReport.provider = Provider.jUnitXML;
    testReport.testSuites = testReportDetailsResponse.test_suites.map((testSuiteResponse, index: number) => {
      const testSuite = this.deserializeJUnitXMLTestSuite(testSuiteResponse, testReportDetailsResponse);
      testSuite.id = index;

      return testSuite;
    });

    return testReport;
  }

  deserializeJUnitXMLTestSuite(
    testSuiteResponse: JUnitXMLTestSuiteResponse,
    testReportDetailsResponse: JUnitXMLTestReportDetailsResponse
  ) {
    const testSuite = new TestSuite();

    const {
      tests: totalCount,
      passed: passedCount,
      failed: failedCount,
      error: errorCount,
      duration
    } = testSuiteResponse.totals;

    if (totalCount === passedCount) {
      testSuite.status = TestSuiteStatus.passed;
    } else if (failedCount > 0 || errorCount > 0) {
      testSuite.status = TestSuiteStatus.failed;
    } else {
      testSuite.status = TestSuiteStatus.skipped;
    }

    testSuite.deviceName = null;
    testSuite.suiteName = testSuiteResponse.name;
    testSuite.deviceOperatingSystem = null;
    testSuite.durationInMilliseconds = Number(duration) / 10000000;
    testSuite.orientation = null;
    testSuite.locale = null;
    testSuite.screenshots = null;
    testSuite.artifacts = testReportDetailsResponse.test_assets.map(({ filename, download_url }) => {
      const testArtifact = new TestArtifact();
      testArtifact.downloadURL = download_url;
      testArtifact.filename = filename;

      return testArtifact;
    });
    testSuite.videoUrl = null;
    testSuite.logUrl = null;
    testSuite.testCases = testSuiteResponse.tests.map((testCaseResponse) =>
      this.deserializeJUnitXMLTestCase(testCaseResponse)
    );

    return testSuite;
  }

  deserializeFirebaseTestlabTestCases(testCasesResponse: FirebaseTestlabTestCasesResponse) {
    const parser = new DOMParser();
    const testSuiteElement = parser.parseFromString(testCasesResponse, 'application/xml').querySelector('testsuite');

    return Array.from(testSuiteElement.querySelectorAll('testcase')).map((testCaseItemElement: Element) => {
      const testCase = new TestCase();

      testCase.name = testCaseItemElement.getAttribute('name');
      testCase.durationInMilliseconds = testCaseItemElement.hasAttribute('time')
        ? Number(testCaseItemElement.getAttribute('time')) * 1000
        : null;
      testCase.context = testCaseItemElement.getAttribute('classname');

      if (testCaseItemElement.querySelector('failure')) {
        testCase.status = TestCaseStatus.failed;
        testCase.summary = testCaseItemElement.querySelector('failure').textContent;
      } else {
        testCase.status = TestCaseStatus.passed;
        testCase.summary = 'passed';
      }

      return testCase;
    });
  }

  deserializeJUnitXMLTestCase(testCaseResponse: JUnitXMLTestCaseResponse) {
    const testCase = new TestCase();

    testCase.name = testCaseResponse.classname;
    switch (testCaseResponse.status) {
      case 'passed':
        testCase.status = TestCaseStatus.passed;

        break;
      case 'skipped':
        testCase.status = TestCaseStatus.skipped;

        break;
      default:
        testCase.status = TestCaseStatus.failed;

        break;
    }
    testCase.durationInMilliseconds = Number(testCaseResponse.duration) / 10000000;
    testCase.context = testCaseResponse.name;
    if (testCaseResponse.error) {
      if (testCaseResponse.error.message) {
        testCase.summary = `${testCaseResponse.error.message}\n\n${testCaseResponse.error.body}`;
      } else {
        testCase.summary = testCaseResponse.error.body;
      }
    } else {
      testCase.summary = testCaseResponse.status;
    }

    return testCase;
  }
}
