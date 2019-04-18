import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from 'src/app/mock-store/testing';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestSuiteDetailsMenuTestArtifactsComponent } from './test-suite-details-menu-test-artifacts.component';
import { TestReport } from 'src/app/models/test-report.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestArtifact } from '../../../../models/test-artifact.model';
import artifactsReducer, { ArtifactStoreState } from 'src/app/store/artifacts/reducer';

describe('TestSuiteDetailsMenuTestArtifactsComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsMenuTestArtifactsComponent>;
  let testArtifactsComponent: TestSuiteDetailsMenuTestArtifactsComponent;
  let store: MockStore<{
    testReport: TestReportState;
    testArtifact: {
      testArtifacts: TestArtifact[];
      downloadAllURL: string;
    };
  }>;
  let testReport: TestReport;
  let testSuite: TestSuite;

  const initialtestReportsState = {
    testReports: [],
    filteredReports: [],
    filter: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ testArtifact: artifactsReducer }),
        InlineSVGModule.forRoot()
      ],
      declarations: [TestSuiteDetailsMenuTestArtifactsComponent],
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

    testReport = new TestReport();
    testSuite = new TestSuite();
    testReport.testSuites = [testSuite];
    testReport.id = 1;
    testSuite.id = 2;

    fixture = TestBed.createComponent(TestSuiteDetailsMenuTestArtifactsComponent);
    testArtifactsComponent = fixture.debugElement.componentInstance;
  });

  beforeEach(inject(
    [Store],
    (mockStore: MockStore<{ testReport: TestReportState; testArtifact: ArtifactStoreState }>) => {
      store = mockStore;
      store.setState({
        testReport: initialtestReportsState,
        testArtifact: undefined
      });
    }
  ));

  it('creates the test artifacts menu component', () => {
    expect(testArtifactsComponent).not.toBeNull();
  });

  describe('when there are some test artifacts', () => {
    beforeEach(() => {
      store.setState({
        testReport: {
          ...initialtestReportsState,
          testReports: [testReport]
        },
        testArtifact: {
          testArtifacts: Array(3)
            .fill(null)
            .map(() => new TestArtifact()),
          downloadAllURL: 'https://bitrise.io/download-all'
        }
      });

      fixture.detectChanges();
    });

    it('renders as many test artifact items as there are test artifacts', () => {
      expect(fixture.debugElement.queryAll(By.css('.test-artifact')).length).toBe(3);
    });

    it('has a button for downloading all the test artifacts, with the appropriate link', () => {
      expect(
        fixture.debugElement.query(By.css('.download-all')).nativeElement.attributes.getNamedItem('href').value
      ).toBe('https://bitrise.io/download-all');
    });
  });
});
