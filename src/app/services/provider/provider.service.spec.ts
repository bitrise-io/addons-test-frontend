import { TestBed } from '@angular/core/testing';
import {
  ProviderService,
  PROVIDER_SERVICE,
  FirebaseTestlabTestReportDetailsResponse,
  JUnitXMLTestReportDetailsResponse,
  Provider,
  FirebaseTestlabTestSuiteResponse,
  JUnitXMLTestSuiteResponse,
  JUnitXMLTestCaseResponse,
  FirebaseTestlabTestCasesResponse
} from './provider.service';
import { TestReport, TestReportType } from 'src/app/models/test-report.model';
import { TestSuite, TestSuiteStatus } from 'src/app/models/test-suite.model';
import { TestCase, TestCaseStatus } from 'src/app/models/test-case.model';

describe('ProviderService', () => {
  let service: ProviderService;

  function basicFirebaseTestlabTestSuiteResponse(): FirebaseTestlabTestSuiteResponse {
    return {
      device_name: 'iPhone 7',
      api_level: 'API Level 24',
      status: 'complete',
      test_results: [
        {
          total: 1
        }
      ],
      outcome: 'failure',
      orientation: 'portrait',
      locale: 'English',
      step_id: 'abcdefgh123456789',
      output_urls: {
        video_url: 'video.mp4',
        test_suite_xml_url: 'ftl_testsuite/1',
        log_urls: ['log1'],
        asset_urls: {
          'file1.txt': 'https://www.bitrise.io/assets/svg/logo-bitrise.svg',
          'file2.txt': 'https://www.bitrise.io/assets/svg/logo-bitrise.svg?param1=value1'
        },
        screenshot_urls: [
          'https://www.bitrise.io/assets/svg/logo-bitrise.svg',
          'https://www.bitrise.io/assets/svg/logo-bitrise.svg?param1=value1'
        ]
      },
      test_type: 'instrumentation',
      test_issues: [
        {
          name: 'Lorem ipsum.'
        }
      ],
      step_duration_in_seconds: 9
    };
  }

  function pendingFirebaseTestlabTestSuiteResponse(): FirebaseTestlabTestSuiteResponse {
    return {
      device_name: 'iPhone 7',
      api_level: 'API Level 24',
      status: 'pending',
      orientation: 'portrait',
      locale: 'English',
      step_id: 'abcdefgh123456789',
      output_urls: {}
    };
  }

  function inProgressFirebaseTestlabTestSuiteResponse(): FirebaseTestlabTestSuiteResponse {
    return {
      device_name: 'iPhone 7',
      api_level: 'API Level 24',
      status: 'inProgress',
      orientation: 'portrait',
      locale: 'English',
      step_id: 'abcdefgh123456789',
      output_urls: {}
    };
  }

  function basicFirebaseTestlabTestCasesResponse(): string {
    // tslint:disable-next-line:max-line-length
    return '<?xml version="1.0" encoding="UTF-8"?>\n<testsuite>\n<properties />\n<testcase name="name A" classname="classname A" failure="The A failed" />\n<testcase name="name B" classname="classname B" time="1.3" />\n</testsuite>';
  }

  function basicJUnitXMLTestSuiteResponse(): JUnitXMLTestSuiteResponse {
    return {
      name: 'JUnitXmlReporter.constructor',
      package: '',
      properties: {
        'compiler.debug': 'on'
      },
      tests: [
        {
          name: 'should default path to an empty string',
          classname: 'JUnitXmlReporter.constructor',
          duration: 20000000,
          status: 'failed',
          error: {
            message: 'test failure',
            body: 'Assertion failed'
          }
        }
      ],
      totals: {
        tests: 1,
        passed: 0,
        skipped: 0,
        failed: 1,
        error: 0,
        duration: 20000000
      }
    };
  }

  function basicJUnitXMLTestCaseResponse(): JUnitXMLTestCaseResponse {
    return {
      name: 'should default path to an empty string',
      classname: 'JUnitXmlReporter.constructor',
      duration: 20000000,
      status: 'passed'
    };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PROVIDER_SERVICE, useClass: ProviderService }]
    });

    service = TestBed.get(PROVIDER_SERVICE);
  });

  it('is created', () => {
    expect(service).toBeTruthy();
  });

  describe('detectProvider', () => {
    let testReportDetailsResponse: FirebaseTestlabTestReportDetailsResponse | JUnitXMLTestReportDetailsResponse;

    describe('when response is with Firebase Testlab format', () => {
      beforeEach(() => {
        testReportDetailsResponse = [basicFirebaseTestlabTestSuiteResponse()];
      });

      it('detects Firebase Testlab', () => {
        expect(service.detectProvider(testReportDetailsResponse)).toBe(Provider.firebaseTestlab);
      });
    });

    describe('when response is with JUnit XML format', () => {
      beforeEach(() => {
        testReportDetailsResponse = {
          id: '1234',
          name: 'JUnit Test A',
          test_suites: [basicJUnitXMLTestSuiteResponse()],
          test_assets: [
            {
              filename: 'file.txt',
              download_url: 'https://www.bitrise.io/assets/svg/logo-bitrise.svg'
            }
          ]
        };
      });

      it('detects JUnit XML', () => {
        expect(service.detectProvider(testReportDetailsResponse)).toBe(Provider.jUnitXML);
      });
    });
  });

  describe('deserializeTestReportDetails', () => {
    [
      {
        detectedProviderName: 'Firebase Testlab',
        detectedProvider: Provider.firebaseTestlab,
        expectedDeserializer: 'deserializeFirebaseTestlabTestReportDetails'
      },
      {
        detectedProviderName: 'JUnit XML',
        detectedProvider: Provider.jUnitXML,
        expectedDeserializer: 'deserializeJUnitXMLTestReportDetails'
      }
    ].forEach((specConfig: any) => {
      describe(`when detected provider is ${specConfig.detectedProviderName}`, () => {
        let testReport: TestReport;

        beforeEach(() => {
          testReport = new TestReport();

          service['detectProvider'] = jasmine.createSpy('detectProvider').and.callFake(() => {
            return specConfig.detectedProvider;
          });

          service[specConfig.expectedDeserializer] = jasmine
            .createSpy(specConfig.expectedDeserializer)
            .and.callFake(() => {
              return testReport;
            });
        });

        it('returns test report', () => {
          expect(service.deserializeTestReportDetails(undefined, testReport)).toBe(testReport);
        });

        it(`calls ${specConfig.expectedDeserializer}`, () => {
          service[specConfig.expectedDeserializer]();

          expect(service[specConfig.expectedDeserializer]).toHaveBeenCalled();
        });
      });
    });
  });

  describe('deserializeFirebaseTestlabTestReportDetails', () => {
    let testReport: TestReport;

    beforeEach(() => {
      testReport = new TestReport();
      service['deserializeFirebaseTestlabTestSuite'] = jasmine
        .createSpy('deserializeFirebaseTestlabTestSuite')
        .and.callFake(() => {
          return new TestSuite();
        });
    });

    it('returns test report', () => {
      expect(service.deserializeFirebaseTestlabTestReportDetails([], testReport)).toBe(testReport);
    });

    it('sets type to UI test, provider to Firebase Testlab', () => {
      service.deserializeFirebaseTestlabTestReportDetails([], testReport);
      expect(testReport.type).toBe(TestReportType.uiTest);
      expect(testReport.provider).toBe(Provider.firebaseTestlab);
    });

    it('deserializes test suites, sets indexes as IDs', () => {
      service.deserializeFirebaseTestlabTestReportDetails(
        [basicFirebaseTestlabTestSuiteResponse(), basicFirebaseTestlabTestSuiteResponse()],
        testReport
      );

      expect(testReport.testSuites.length).toBe(2);
      expect(testReport.testSuites[0].id).toBe(0);
      expect(testReport.testSuites[1].id).toBe(1);
    });
  });

  describe('deserializeFirebaseTestlabTestSuite', () => {
    let testSuiteResponse: FirebaseTestlabTestSuiteResponse;

    [
      {
        statusName: 'pending',
        specPreparation: () => {
          testSuiteResponse = pendingFirebaseTestlabTestSuiteResponse();
        },
        expectedStatusName: 'in progress',
        expectedStatus: TestSuiteStatus.inProgress
      },
      {
        statusName: 'in progress',
        specPreparation: () => {
          testSuiteResponse = inProgressFirebaseTestlabTestSuiteResponse();
        },
        expectedStatusName: 'in progress',
        expectedStatus: TestSuiteStatus.inProgress
      },
      {
        statusName: 'complete & inconclusive',
        specPreparation: () => {
          testSuiteResponse = basicFirebaseTestlabTestSuiteResponse();
          testSuiteResponse.status = 'complete';
          testSuiteResponse.outcome = 'inconclusive';
        },
        expectedStatusName: 'inconclusive',
        expectedStatus: TestSuiteStatus.inconclusive
      },
      {
        statusName: 'complete & passed',
        specPreparation: () => {
          testSuiteResponse = basicFirebaseTestlabTestSuiteResponse();
          testSuiteResponse.status = 'complete';
          testSuiteResponse.outcome = 'success';
        },
        expectedStatusName: 'passed',
        expectedStatus: TestSuiteStatus.passed
      },
      {
        statusName: 'complete & failed',
        specPreparation: () => {
          testSuiteResponse = basicFirebaseTestlabTestSuiteResponse();
          testSuiteResponse.status = 'complete';
          testSuiteResponse.outcome = 'failure';
        },
        expectedStatusName: 'failed',
        expectedStatus: TestSuiteStatus.failed
      },
      {
        statusName: 'complete & skipped',
        specPreparation: () => {
          testSuiteResponse = basicFirebaseTestlabTestSuiteResponse();
          testSuiteResponse.status = 'complete';
          testSuiteResponse.outcome = 'skipped';
        },
        expectedStatusName: 'skipped',
        expectedStatus: TestSuiteStatus.skipped
      }
    ].forEach((specConfig) => {
      describe(`when response has ${specConfig.statusName} status`, () => {
        beforeEach(() => {
          specConfig.specPreparation();
        });

        it(`sets status to ${specConfig.expectedStatusName}`, () => {
          const testSuite = service.deserializeFirebaseTestlabTestSuite(testSuiteResponse);

          expect(testSuite.status).toBe(specConfig.expectedStatus);
        });
      });
    });

    it('returns test suite', () => {
      expect(service.deserializeFirebaseTestlabTestSuite(testSuiteResponse) instanceof TestSuite).toBeTruthy();
    });

    it('sets screenshots', () => {
      const testSuite = service.deserializeFirebaseTestlabTestSuite(testSuiteResponse);

      expect(testSuite.screenshots.length).toBe(2);
      expect(testSuite.screenshots[0].url).toBe('https://www.bitrise.io/assets/svg/logo-bitrise.svg');
      expect(testSuite.screenshots[0].filename).toBe('logo-bitrise.svg');
      expect(testSuite.screenshots[1].url).toBe('https://www.bitrise.io/assets/svg/logo-bitrise.svg?param1=value1');
      expect(testSuite.screenshots[1].filename).toBe('logo-bitrise.svg');
    });

    it('sets artifacts', () => {
      const testSuite = service.deserializeFirebaseTestlabTestSuite(testSuiteResponse);

      expect(testSuite.artifacts.length).toBe(2);
      expect(testSuite.artifacts[0].downloadURL).toBe('https://www.bitrise.io/assets/svg/logo-bitrise.svg');
      expect(testSuite.artifacts[0].filename).toBe('file1.txt');
      expect(testSuite.artifacts[1].downloadURL).toBe(
        'https://www.bitrise.io/assets/svg/logo-bitrise.svg?param1=value1'
      );
      expect(testSuite.artifacts[1].filename).toBe('file2.txt');
    });
  });

  describe('deserializeJUnitXMLTestReportDetails', () => {
    let testReport: TestReport;

    beforeEach(() => {
      testReport = new TestReport();
      service['deserializeJUnitXMLTestSuite'] = jasmine.createSpy('deserializeJUnitXMLTestSuite').and.callFake(() => {
        return new TestSuite();
      });
    });

    it('returns test report', () => {
      expect(
        service.deserializeJUnitXMLTestReportDetails(
          {
            id: 'test-report',
            name: 'Test Report',
            test_suites: [basicJUnitXMLTestSuiteResponse()],
            test_assets: []
          },
          testReport
        )
      ).toBe(testReport);
    });

    it('sets type to unit test, provider to JUnit XML', () => {
      service.deserializeJUnitXMLTestReportDetails(
        {
          id: 'test-report',
          name: 'Test Report',
          test_suites: [basicJUnitXMLTestSuiteResponse()],
          test_assets: []
        },
        testReport
      );

      expect(testReport.type).toBe(TestReportType.unitTest);
      expect(testReport.provider).toBe(Provider.jUnitXML);
    });

    it('deserializes test suites, sets indexes as IDs', () => {
      service.deserializeJUnitXMLTestReportDetails(
        {
          id: 'test-report',
          name: 'Test Report',
          test_suites: [basicJUnitXMLTestSuiteResponse(), basicJUnitXMLTestSuiteResponse()],
          test_assets: []
        },
        testReport
      );

      expect(testReport.testSuites.length).toBe(2);
      expect(testReport.testSuites[0].id).toBe(0);
      expect(testReport.testSuites[1].id).toBe(1);
    });
  });

  describe('deserializeJUnitXMLTestSuite', () => {
    let testSuiteResponse: JUnitXMLTestSuiteResponse;
    let testReportDetailsResponse: JUnitXMLTestReportDetailsResponse;

    beforeEach(() => {
      testSuiteResponse = basicJUnitXMLTestSuiteResponse();
      testReportDetailsResponse = {
        id: 'test-report',
        name: 'Test Report',
        test_suites: [basicJUnitXMLTestSuiteResponse()],
        test_assets: [
          {
            filename: 'file1.txt',
            download_url: 'https://www.bitrise.io/assets/svg/logo-bitrise.svg'
          },
          {
            filename: 'file2.txt',
            download_url: 'https://www.bitrise.io/assets/svg/logo-bitrise.svg'
          }
        ]
      };

      service['deserializeJUnitXMLTestCase'] = jasmine.createSpy('deserializeJUnitXMLTestCase').and.callFake(() => {
        return new TestCase();
      });
    });

    it('returns test suite with appropriate data', () => {
      const testSuite = service.deserializeJUnitXMLTestSuite(testSuiteResponse, testReportDetailsResponse);

      expect(testSuite instanceof TestSuite).toBeTruthy();
      expect(testSuite.deviceName).toBeNull();
      expect(testSuite.suiteName).toBe('JUnitXmlReporter.constructor');
      expect(testSuite.deviceOperatingSystem).toBeNull();
      expect(testSuite.durationInMilliseconds).toBe(2);
      expect(testSuite.orientation).toBeNull();
      expect(testSuite.locale).toBeNull();
      expect(testSuite.screenshots).toBeNull();
      expect(testSuite.videoUrl).toBeNull();
      expect(testSuite.logUrl).toBeNull();
    });

    [
      {
        statusName: 'all passed',
        specPreparation: () => {
          testSuiteResponse.totals = {
            tests: 3,
            passed: 3,
            skipped: 0,
            failed: 0,
            error: 0,
            duration: 20000000
          };
        },
        expectedStatusName: 'passed',
        expectedStatus: TestSuiteStatus.passed
      },
      {
        statusName: 'some passed, some skipped',
        specPreparation: () => {
          testSuiteResponse.totals = {
            tests: 3,
            passed: 2,
            skipped: 1,
            failed: 0,
            error: 0,
            duration: 20000000
          };
        },
        expectedStatusName: 'skipped',
        expectedStatus: TestSuiteStatus.skipped
      },
      {
        statusName: 'some passed, some failed',
        specPreparation: () => {
          testSuiteResponse.totals = {
            tests: 3,
            passed: 2,
            skipped: 0,
            failed: 1,
            error: 0,
            duration: 20000000
          };
        },
        expectedStatusName: 'failed',
        expectedStatus: TestSuiteStatus.failed
      },
      {
        statusName: 'some passed, some error',
        specPreparation: () => {
          testSuiteResponse.totals = {
            tests: 3,
            passed: 2,
            skipped: 0,
            failed: 0,
            error: 1,
            duration: 20000000
          };
        },
        expectedStatusName: 'failed',
        expectedStatus: TestSuiteStatus.failed
      },
      {
        statusName: 'some failed, some skipped',
        specPreparation: () => {
          testSuiteResponse.totals = {
            tests: 3,
            passed: 0,
            skipped: 1,
            failed: 2,
            error: 0,
            duration: 20000000
          };
        },
        expectedStatusName: 'failed',
        expectedStatus: TestSuiteStatus.failed
      },
      {
        statusName: 'some error, some skipped',
        specPreparation: () => {
          testSuiteResponse.totals = {
            tests: 3,
            passed: 0,
            skipped: 1,
            failed: 0,
            error: 2,
            duration: 20000000
          };
        },
        expectedStatusName: 'failed',
        expectedStatus: TestSuiteStatus.failed
      }
    ].forEach((specConfig) => {
      describe(`when response has ${specConfig.statusName} status`, () => {
        beforeEach(() => {
          specConfig.specPreparation();
        });

        it(`sets status to ${specConfig.expectedStatusName}`, () => {
          const testSuite = service.deserializeJUnitXMLTestSuite(testSuiteResponse, testReportDetailsResponse);

          expect(testSuite.status).toBe(specConfig.expectedStatus);
        });
      });
    });

    it('deserializes test cases', () => {
      const testSuite = service.deserializeJUnitXMLTestSuite(testSuiteResponse, testReportDetailsResponse);

      expect(testSuite.testCases.length).toBe(1);
    });

    it('sets artifacts from test report response', () => {
      const testSuite = service.deserializeJUnitXMLTestSuite(testSuiteResponse, testReportDetailsResponse);

      expect(testSuite.artifacts.length).toBe(2);
      expect(testSuite.artifacts[0].downloadURL).toBe('https://www.bitrise.io/assets/svg/logo-bitrise.svg');
      expect(testSuite.artifacts[0].filename).toBe('file1.txt');
      expect(testSuite.artifacts[1].downloadURL).toBe('https://www.bitrise.io/assets/svg/logo-bitrise.svg');
      expect(testSuite.artifacts[1].filename).toBe('file2.txt');
    });
  });

  describe('deserializeFirebaseTestlabTestCases', () => {
    let testCasesResponse: FirebaseTestlabTestCasesResponse;

    beforeEach(() => {
      testCasesResponse = basicFirebaseTestlabTestCasesResponse();
    });

    it('returns test cases with appropriate data', () => {
      const testCases = service.deserializeFirebaseTestlabTestCases(testCasesResponse);

      expect(testCases.length).toBe(2);

      expect(testCases[0].name).toBe('name A');
      expect(testCases[0].status).toBe(TestCaseStatus.failed);
      expect(testCases[0].context).toBe('classname A');
      expect(testCases[0].durationInMilliseconds).toBeNull();
      expect(testCases[0].summary).toBe('The A failed');

      expect(testCases[1].name).toBe('name B');
      expect(testCases[1].status).toBe(TestCaseStatus.passed);
      expect(testCases[1].context).toBe('classname B');
      expect(testCases[1].durationInMilliseconds).toBe(1300);
      expect(testCases[1].summary).toBe('passed');
    });
  });

  describe('deserializeJUnitXMLTestCase', () => {
    let testCaseResponse: JUnitXMLTestCaseResponse;

    beforeEach(() => {
      testCaseResponse = basicJUnitXMLTestCaseResponse();
    });

    it('returns test case with appropriate data', () => {
      const testCase = service.deserializeJUnitXMLTestCase(testCaseResponse);

      expect(testCase instanceof TestCase).toBeTruthy();
      expect(testCase.name).toBe('JUnitXmlReporter.constructor');
      expect(testCase.durationInMilliseconds).toBe(2);
      expect(testCase.context).toBe('should default path to an empty string');
    });

    [
      {
        statusName: 'passed',
        specPreparation: () => {},
        expectedStatusName: 'passed',
        expectedStatus: TestCaseStatus.passed,
        expectedSummary: 'passed'
      },
      {
        statusName: 'failed',
        specPreparation: () => {
          testCaseResponse.status = 'failed';
          testCaseResponse.error = {
            message: 'Error message',
            body: 'Error body'
          };
        },
        expectedStatusName: 'failed',
        expectedStatus: TestCaseStatus.failed,
        expectedSummary: 'Error message\n\nError body'
      },
      {
        statusName: 'failed (no message)',
        specPreparation: () => {
          testCaseResponse.status = 'failed';
          testCaseResponse.error = {
            body: 'Error body'
          };
        },
        expectedStatusName: 'failed',
        expectedStatus: TestCaseStatus.failed,
        expectedSummary: 'Error body'
      },
      {
        statusName: 'skipped',
        specPreparation: () => {
          testCaseResponse.status = 'skipped';
        },
        expectedStatusName: 'skipped',
        expectedStatus: TestCaseStatus.skipped,
        expectedSummary: 'skipped'
      }
    ].forEach((specConfig: any) => {
      describe(`when response has ${specConfig.statusName} status`, () => {
        let testCase: TestCase;

        beforeEach(() => {
          specConfig.specPreparation();
          testCase = service.deserializeJUnitXMLTestCase(testCaseResponse);
        });

        it(`sets status to ${specConfig.expectedStatusName}`, () => {
          expect(testCase.status).toBe(specConfig.expectedStatus);
        });

        it('sets summary with appropriate value', () => {
          expect(testCase.summary).toBe(specConfig.expectedSummary);
        });
      });
    });
  });
});
