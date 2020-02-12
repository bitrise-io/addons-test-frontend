import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from 'src/app/mock-store/testing';

import { TestSuiteDetailsMenuTestCasesComponent } from './test-suite-details-menu-test-cases.component';
import { TestSuiteDetailsMenuModule } from '../menu.module';
import { TestReport } from 'src/app/models/test-report.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestCase } from 'src/app/models/test-case.model';
import { initialState } from 'src/app/store/reports/reducer.spec';

describe('TestSuiteDetailsMenuTestCasesComponent', () => {
  let store: MockStore<{
    testReport: TestReportState;
  }>;
  let testReport: TestReport;
  let testSuite: TestSuite;
  let fixture: ComponentFixture<TestSuiteDetailsMenuTestCasesComponent>;
  let component: TestSuiteDetailsMenuTestCasesComponent;

  const initialtestReportsState = initialState;

  beforeEach(async(() => {
    testReport = new TestReport();
    testSuite = new TestSuite();
    testReport.testSuites = [testSuite];
    testReport.id = '1';
    testSuite.id = 2;
    testSuite.testCases = Array(3)
      .fill(null)
      .map(() => new TestCase());

    TestBed.configureTestingModule({
      imports: [
        TestSuiteDetailsMenuModule,
        RouterTestingModule.withRoutes([
          {
            path: 'testreport/:testReportId/testsuite/:testSuiteId',
            component: TestSuiteDetailsMenuTestCasesComponent
          }
        ]),
        InlineSVGModule.forRoot(),
        HttpClientTestingModule
      ],
      providers: [
        provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              data: of({ testSuite: { selectedTestReport: testReport, selectedTestSuite: testSuite } })
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
    fixture = TestBed.createComponent(TestSuiteDetailsMenuTestCasesComponent);
    component = fixture.componentInstance;
    store = mockStore;
    store.setState({
      testReport: {
        ...initialtestReportsState,
        testReports: [testReport]
      }
    });
    fixture.detectChanges();
  }));

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('has elements for each test case', () => {
    expect(fixture.debugElement.queryAll(By.css('bitrise-test-case')).length).toBe(3);
  });
});
