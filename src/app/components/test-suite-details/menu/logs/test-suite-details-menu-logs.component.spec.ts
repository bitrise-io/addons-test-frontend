import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { MockStore, provideMockStore } from 'src/app/mock-store/testing';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestSuiteDetailsMenuLogsComponent } from './test-suite-details-menu-logs.component';
import { LogLine } from 'src/app/models/log-line.model';
import { LogLineLevel } from 'src/app/models/log-line-level.model';
import { TestReport } from 'src/app/models/test-report.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestSuiteResolve } from 'src/app/services/test-suite.resolve.service';
import { Log } from '../../../../models/log.model';
import { LogReducer, LogStoreState } from 'src/app/store/log/reducer';
import { initialState } from 'src/app/store/reports/reducer.spec';

describe('TestSuiteDetailsMenuLogsComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsMenuLogsComponent>;
  let logsComponent: TestSuiteDetailsMenuLogsComponent;
  let store: MockStore<{
    testReport: TestReportState;
    log: LogStoreState;
  }>;
  let testReport: TestReport;
  let testSuite: TestSuite;
  let log: Log;

  const initialtestReportsState = initialState;

  beforeEach(() => {
    testReport = new TestReport();
    testSuite = new TestSuite();
    testReport.testSuites = [testSuite];
    testReport.id = '1';
    testSuite.id = 2;
    testSuite.logUrl = 'https://bitrise.io/log-url';

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        StoreModule.forRoot({ log: LogReducer }),
        InlineSVGModule.forRoot()
      ],
      declarations: [TestSuiteDetailsMenuLogsComponent],
      providers: [
        provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              data: of({ testSuite: { selectedTestReport: testReport, selectedTestSuite: testSuite } })
            }
          }
        },
        TestSuiteResolve
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuiteDetailsMenuLogsComponent);
    logsComponent = fixture.debugElement.componentInstance;
  });

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState; log: LogStoreState }>) => {
    store = mockStore;
    store.setState({
      testReport: initialtestReportsState,
      log: undefined
    });
  }));

  it('creates the log menu component', () => {
    expect(logsComponent).not.toBeNull();
  });

  describe('when there is short log', () => {
    beforeEach(() => {
      log = new Log();
      log.lines = Array(3)
        .fill(null)
        .map(() => new LogLine());

      store.setState({
        testReport: {
          ...initialtestReportsState,
          testReports: [testReport]
        },
        log: {
          logs: {
            [testReport.id]: {
              [testSuite.id]: {
                log: log,
                downloadURL: 'https://bitrise.io/download-log'
              }
            }
          }
        }
      });

      fixture.detectChanges();
    });

    it('renders as many line elements as there are log lines', () => {
      expect(fixture.debugElement.queryAll(By.css('.line')).length).toBe(3);
    });

    it('has a button for downloading the log, with the appropriate link', () => {
      expect(
        fixture.debugElement.query(By.css('.download-log')).nativeElement.attributes.getNamedItem('href').value
      ).toBe('https://bitrise.io/download-log');
    });
  });

  describe('when there is long log', () => {
    beforeEach(() => {
      log = new Log();
      log.lines = Array(22)
        .fill(null)
        .map(() => new LogLine());
      store.setState({
        testReport: {
          ...initialtestReportsState,
          testReports: [testReport]
        },
        log: {
          logs: {
            [testReport.id]: {
              [testSuite.id]: {
                log: log,
                downloadURL: 'https://bitrise.io/download-log'
              }
            }
          }
        }
      });

      fixture.detectChanges();
    });

    it('renders maximum number of log lines initially allowed', () => {
      expect(fixture.debugElement.queryAll(By.css('.line')).length).toBe(20);
    });
  });

  describe('when level filter is turned on', () => {
    let dropdownElement: DebugElement;

    beforeEach(() => {
      log = new Log();
      log.lines = Array(7)
        .fill(null)
        .map(() => new LogLine());
      log.lines[0].level = LogLineLevel.warning;
      log.lines[1].level = LogLineLevel.warning;
      log.lines[2].level = LogLineLevel.warning;
      log.lines[3].level = LogLineLevel.info;
      log.lines[4].level = LogLineLevel.info;
      log.lines[5].level = LogLineLevel.error;
      log.lines[6].level = LogLineLevel.error;
      store.setState({
        testReport: {
          ...initialtestReportsState,
          testReports: [testReport]
        },
        log: {
          logs: {
            [testReport.id]: {
              [testSuite.id]: {
                log: log,
                downloadURL: 'https://bitrise.io/download-log'
              }
            }
          }
        }
      });

      fixture.detectChanges();

      dropdownElement = fixture.debugElement.query(By.css('.level-filter-select'));
      dropdownElement.nativeElement.value = dropdownElement.nativeElement.options[1].value;
      dropdownElement.nativeElement.dispatchEvent(new Event('change'));

      fixture.detectChanges();
    });

    it('only renders log lines with that level', () => {
      expect(fixture.debugElement.queryAll(By.css('.line')).length).toBe(2);
    });
  });
});
