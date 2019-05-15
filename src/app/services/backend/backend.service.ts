import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { BackendService, TestReportsResult, LogResult, TestReportResult } from './backend.model';
import {
  ProviderService,
  Provider,
  FirebaseTestlabTestReportDetailsResponse,
  JUnitXMLTestReportDetailsResponse,
  FirebaseTestlabTestCasesResponse
} from 'src/app/services/provider/provider.service';
import { Performance } from 'src/app/models/performance.model';
import { TestReportResponse, TestReport } from 'src/app/models/test-report.model';
import { TestSuite, TestSuiteStatus } from 'src/app/models/test-suite.model';
import { Log, RawLog } from 'src/app/models/log.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class RealBackendService implements BackendService {
  constructor(private httpClient: HttpClient, private providerService: ProviderService) {}

  getPerformance = (buildSlug: string, testSuite: TestSuite): Observable<Performance> =>
    this.httpClient.get<Performance>(`${environment.apiRootUrl}/api/builds/${buildSlug}/steps/${testSuite.stepID}`);

  getReports = (buildSlug: string): Observable<TestReportsResult> =>
    this.httpClient.get(`${environment.apiRootUrl}/api/builds/${buildSlug}/test_reports`).pipe(
      map((testReportResponses: TestReportResponse[]) =>
        testReportResponses.map((testReportResponse: TestReportResponse) =>
          new TestReport().deserialize(testReportResponse)
        )
      ),
      map((testReports: TestReport[]) => {
        return { testReports };
      })
    );

  getReportDetails = (buildSlug: string, testReport: TestReport): Observable<TestReportResult> =>
    this.httpClient.get(`${environment.apiRootUrl}/api/builds/${buildSlug}/test_reports/${testReport.id}`).pipe(
      map((testReportDetailsResponse: FirebaseTestlabTestReportDetailsResponse | JUnitXMLTestReportDetailsResponse) =>
        this.providerService.deserializeTestReportDetails(testReportDetailsResponse, testReport)
      ),
      mergeMap((_testReport: TestReport) => {
        if (_testReport.provider === Provider.firebaseTestlab) {
          return forkJoin(
            _testReport.testSuites.map((testSuite: TestSuite) => {
              if (testSuite.status === TestSuiteStatus.inProgress) {
                return of({ _testReport });
              } else {
                return this.httpClient
                  .get(testSuite.testCasesURL, {
                    headers: { 'Access-Control-Allow-Origin': '*' },
                    responseType: 'text'
                  })
                  .pipe(
                    map((testCasesResponse: FirebaseTestlabTestCasesResponse) => {
                      testSuite.testCases = this.providerService.deserializeFirebaseTestlabTestCases(testCasesResponse);
                    })
                  );
              }
            })
          ).pipe(
            map(() => {
              return { testReport };
            })
          );
        } else {
          return of({ testReport });
        }
      })
    );

  getLog = (testReport: TestReport, testSuite: TestSuite): Observable<LogResult> =>
    this.httpClient
      .get(testSuite.logUrl, {
        headers: { 'Access-Control-Allow-Origin': '*' },
        responseType: 'text'
      })
      .pipe(
        map((fullLog: string) => {
          const log = new Log().deserialize(<RawLog>fullLog);

          return {
            logs: {
              [testReport.id]: {
                [testSuite.id]: {
                  log
                }
              }
            }
          };
        })
      );
}
