import { Injectable } from '@angular/core';
import { TestReport, TestReportResponse, TestReportType } from 'src/app/models/test-report.model';
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
  test_results: [
    {
      total?: Number;
      failed?: Number;
    }
  ];
  outcome: string;
  orientation: string;
  locale: string;
  step_id: string;
  output_urls: {
    video_url: string;
    test_suite_xml_url: string;
    log_urls: string[];
    asset_urls: {
      [filename: string]: string;
    };
    screenshot_urls: string[];
  };
  test_type: string;
  test_issues: [
    {
      name: string;
    }
  ];
  step_duration_in_seconds: Number;
};

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
    message: string;
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

    testReport.testSuites = testReportDetailsResponse.map((testSuiteResponse: FirebaseTestlabTestSuiteResponse) =>
      this.deserializeFirebaseTestlabTestSuite(testSuiteResponse, new TestSuite())
    );

    return testReport;
  }

  deserializeFirebaseTestlabTestSuite(testSuiteResponse: FirebaseTestlabTestSuiteResponse, testSuite: TestSuite) {
    switch (testSuiteResponse.status) {
      case 'pending':
      case 'inProgress':
        testSuite.status = TestSuiteStatus.inconclusive;

        break;
      case 'complete':
        if (testSuiteResponse.outcome == 'inconclusive') {
          testSuite.status = TestSuiteStatus.inconclusive;

          break;
        }

        if (testSuiteResponse.outcome == 'skipped') {
          testSuite.status = TestSuiteStatus.skipped;

          break;
        }

        if (testSuiteResponse.outcome == 'failure') {
          testSuite.status = TestSuiteStatus.failed;

          break;
        }

        testSuite.status = TestSuiteStatus.passed;
    }

    testSuite.deviceName = testSuiteResponse.device_name;
    testSuite.suiteName = null;
    testSuite.deviceOperatingSystem = testSuiteResponse.api_level;
    testSuite.durationInMilliseconds = 1000 * Number(testSuiteResponse.step_duration_in_seconds);
    testSuite.orientation = TestSuiteOrientation[testSuiteResponse.orientation];
    testSuite.locale = testSuiteResponse.locale;
    testSuite.screenshots = testSuiteResponse.output_urls.screenshot_urls.map((screenshotURL) => {
      const filenameRegExp = /^.+\/([^?\n]*).*$/;

      return {
        url: screenshotURL,
        filename: filenameRegExp.test(screenshotURL) ? filenameRegExp.exec(screenshotURL)[1] : null
      };
    });
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

    return testSuite;
  }

  deserializeJUnitXMLTestReportDetails(
    testReportDetailsResponse: JUnitXMLTestReportDetailsResponse,
    testReport: TestReport
  ) {
    testReport.type = TestReportType.unitTest;
    testReport.testSuites = testReportDetailsResponse.test_suites.map((testSuiteResponse) => {
      return this.deserializeJUnitXMLTestSuite(testSuiteResponse, testReportDetailsResponse, new TestSuite());
    });

    return testReport;
  }

  deserializeJUnitXMLTestSuite(
    testSuiteResponse: JUnitXMLTestSuiteResponse,
    testReportDetailsResponse: JUnitXMLTestReportDetailsResponse,
    testSuite: TestSuite
  ) {
    if (testSuiteResponse.totals.tests == testSuiteResponse.totals.passed) {
      testSuite.status = TestSuiteStatus.passed;
    } else if (testSuiteResponse.totals.skipped > 0) {
      testSuite.status = TestSuiteStatus.skipped;
    } else {
      testSuite.status = TestSuiteStatus.failed;
    }

    testSuite.deviceName = null;
    testSuite.suiteName = testSuiteResponse.name;
    testSuite.deviceOperatingSystem = null;
    testSuite.durationInMilliseconds = Number(testSuiteResponse.totals.duration);
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
    testSuite.testCases = testSuiteResponse.tests.map((testCaseResponse) => {
      return this.deserializeJUnitXMLTestCase(testCaseResponse, new TestCase());
    });

    return testSuite;
  }

  deserializeJUnitXMLTestCase(testCaseResponse: JUnitXMLTestCaseResponse, testCase: TestCase) {
    testCase.name = testCaseResponse.name;
    testCase.status = testCaseResponse.status === 'passed' ? TestCaseStatus.passed : TestCaseStatus.failed;
    testCase.durationInMilliseconds = Number(testCaseResponse.duration);
    testCase.context = testCaseResponse.classname;
    testCase.summary = testCaseResponse.error ? `${testCaseResponse.error.message}\n\n${testCaseResponse.error.body}` : testCaseResponse.status;

    return testCase;
  }
}
