import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';

import { TestSuiteDetailsMenuTestCasesComponent } from './test-suite-details-menu-test-cases.component';
import { TestSuiteDetailsMenuModule } from '../menu.module';
import { MockStore } from 'src/app/store.mock';
import { TestReport } from 'src/app/models/test-report.model';

describe('TestSuiteDetailsMenuTestCasesComponent', () => {
  let store: MockStore<{
    testReports: TestReport[];
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
      providers: [{ provide: Store, useClass: MockStore }]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore<{ testReports: TestReport[] }>) => {
    fixture = TestBed.createComponent(TestSuiteDetailsMenuTestCasesComponent);
    component = fixture.componentInstance;
    store = mockStore;
    store.setState({
      testReports: []
    });
    fixture.detectChanges();
  }));

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });
});
