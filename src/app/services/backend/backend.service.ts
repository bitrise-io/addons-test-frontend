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

@Injectable()
export class RealBackendService implements BackendService {
  buildSlug = 'build-2019-05-09_14-46-29';

  constructor(private httpClient: HttpClient, private providerService: ProviderService) {}

  getPerformance(testSuite: TestSuite): Observable<Performance> {
    return this.httpClient
      .get(`http://localhost:5001/api/builds/${this.buildSlug}/steps/${testSuite.stepID}`)
      .pipe(map((performance: Performance) => performance));
  }

  getReports(): Observable<TestReportsResult> {
    return this.httpClient.get(`http://localhost:5001/api/builds/${this.buildSlug}/test_reports`).pipe(
      map((testReportResponses: TestReportResponse[]) =>
        testReportResponses.map((testReportResponse: TestReportResponse) =>
          new TestReport().deserialize(testReportResponse)
        )
      ),
      map((testReports: TestReport[]) => {
        return { testReports: testReports };
      })
    );
  }

  getReportDetails(testReport: TestReport): Observable<TestReportResult> {
    return this.httpClient
      .get(`http://localhost:5001/api/builds/${this.buildSlug}/test_reports/${testReport.id}`)
      .pipe(
        map((testReportDetailsResponse: FirebaseTestlabTestReportDetailsResponse | JUnitXMLTestReportDetailsResponse) =>
          this.providerService.deserializeTestReportDetails(testReportDetailsResponse, testReport)
        ),
        mergeMap((testReport: TestReport) => {
          if (testReport.provider === Provider.firebaseTestlab) {
            return forkJoin(
              testReport.testSuites.map((testSuite: TestSuite) => {
                if (testSuite.status === TestSuiteStatus.inProgress) {
                  return of({ testReport });
                } else {
                  return this.httpClient
                    .get(testSuite.testCasesURL, {
                      headers: { 'Access-Control-Allow-Origin': '*' },
                      responseType: 'text'
                    })
                    .pipe(
                      map((testCasesResponse: FirebaseTestlabTestCasesResponse) => {
                        testSuite.testCases = this.providerService.deserializeFirebaseTestlabTestCases(
                          testCasesResponse
                        );

                        return { testReport };
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
  }

  getLog(testReport: TestReport, testSuite: TestSuite): Observable<LogResult> {
    return this.httpClient.get(testSuite.logUrl, {
      headers: { 'Access-Control-Allow-Origin': '*' },
      responseType: 'text'
    }).pipe(
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
}
