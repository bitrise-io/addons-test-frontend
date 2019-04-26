import { Component, Input } from '@angular/core';
import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';

import { TestSuiteDetailsComponent } from './test-suite-details.component';
import reportsReducer, { TestReportState } from 'src/app/store/reports/reducer';
import { TestReport } from '../../models/test-report.model';
import { TestSuite } from '../../models/test-suite.model';
import { MockStore, provideMockStore } from 'src/app/mock-store/testing';

@Component({
  selector: 'bitrise-test-suite-details-header',
  template: ''
})
class MockTestSuiteDetailsHeaderComponent {
  @Input() testSuite: TestSuite;
  @Input() previousTestSuite: TestSuite;
  @Input() nextTestSuite: TestSuite;
}

xdescribe('TestSuiteDetailsComponent', () => {
  let store: MockStore<{
    testReport: TestReportState;
  }>;
  let fixture: ComponentFixture<TestSuiteDetailsComponent>;
  let testSuiteDetailsComponent: TestSuiteDetailsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule, StoreModule.forRoot({ testReport: reportsReducer })],
      declarations: [TestSuiteDetailsComponent, MockTestSuiteDetailsHeaderComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { testReportId: 1 }
            },
            params: from([{ testReportId: 1 }]),
            firstChild: {
              snapshot: {
                routeConfig: { path: 'testcases' }
              }
            }
          }
        },
        provideMockStore({})
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuiteDetailsComponent);
    testSuiteDetailsComponent = fixture.debugElement.componentInstance;

    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
    const testReportIds = ['1', '2', '3'];

    store = mockStore;
    store.setState({
      testReport: {
        testReports: testReportIds.map((testReportId: string) => {
          const testReport = new TestReport();
          testReport.id = testReportId;

          return testReport;
        }),
        filteredReports: [],
        filter: null
      }
    });
  }));

  it('creates the test suite details component', () => {
    expect(testSuiteDetailsComponent).not.toBeNull();
  });
});
