import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';

import { TestSuiteDetailsMenuTestCasesComponent } from './test-suite-details-menu-test-cases.component';
import { TestSuiteDetailsMenuModule } from '../menu.module';
import { MockStore, provideMockStore } from 'src/app/mock-store/testing';
import { TestReportState } from 'src/app/store/reports/reducer';

describe('TestSuiteDetailsMenuTestCasesComponent', () => {
  let store: MockStore<{
    testReport: TestReportState;
  }>;
  let fixture: ComponentFixture<TestSuiteDetailsMenuTestCasesComponent>;
  let component: TestSuiteDetailsMenuTestCasesComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestSuiteDetailsMenuModule,
        RouterTestingModule.withRoutes([
          {
            path: 'testreport/:testReportId/testsuite/:testSuiteId',
            component: TestSuiteDetailsMenuTestCasesComponent
          }
        ])
      ],
      providers: [provideMockStore({})]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
    fixture = TestBed.createComponent(TestSuiteDetailsMenuTestCasesComponent);
    component = fixture.componentInstance;
    store = mockStore;
    store.setState({
      testReport: {
        testReports: [],
        filteredReports: [],
        filter: null
      }
    });
    fixture.detectChanges();
  }));

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });
});
