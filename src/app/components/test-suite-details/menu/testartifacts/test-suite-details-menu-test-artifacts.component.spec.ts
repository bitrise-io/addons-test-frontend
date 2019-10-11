import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { InlineSVGModule } from 'ng-inline-svg';
import { WINDOW } from 'ngx-window-token';

import { MockStore, provideMockStore } from 'src/app/mock-store/testing';
import { TestSuiteDetailsMenuTestArtifactsComponent } from './test-suite-details-menu-test-artifacts.component';
import { TestReport } from 'src/app/models/test-report.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestArtifact } from '../../../../models/test-artifact.model';
import { ArtifactsReducer, ArtifactStoreState } from 'src/app/store/artifacts/reducer';
import { ZipperService } from 'src/app/services/zipper.service';
import { AppResult } from 'src/app/services/backend/backend.model';

describe('TestSuiteDetailsMenuTestArtifactsComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsMenuTestArtifactsComponent>;
  let testArtifactsComponent: TestSuiteDetailsMenuTestArtifactsComponent;
  let store: MockStore<{
    app: AppResult;
    testReport: TestReportState;
    testArtifact: {
      testArtifacts: TestArtifact[];
    };
  }>;
  let zipper: ZipperService;
  let testReport: TestReport;
  let testSuite: TestSuite;

  const initialAppResultState = {
    slug: undefined,
    name: undefined
  };

  const initialtestReportsState = {
    testReports: [],
    filteredReports: [],
    filter: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ testArtifact: ArtifactsReducer }),
        InlineSVGModule.forRoot()
      ],
      declarations: [TestSuiteDetailsMenuTestArtifactsComponent],
      providers: [
        {
          provide: WINDOW,
          useValue: {
            analytics: {
              track: () => {}
            }
          }
        },
        provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              data: of({ testSuite: { selectedTestReport: testReport, selectedTestSuite: testSuite } })
            }
          }
        },
        {
          provide: ZipperService,
          useValue: {
            zipFilesFromUrls: jasmine.createSpy('zipFilesFromUrls')
          }
        }
      ]
    }).compileComponents();

    testReport = new TestReport();
    testSuite = new TestSuite();
    testReport.testSuites = [testSuite];
    testReport.id = '1';
    testSuite.id = 2;
    testSuite.suiteName = 'Some Device';

    fixture = TestBed.createComponent(TestSuiteDetailsMenuTestArtifactsComponent);
    zipper = TestBed.get(ZipperService);
    testArtifactsComponent = fixture.debugElement.componentInstance;
  });

  beforeEach(inject(
    [Store],
    (mockStore: MockStore<{ app: AppResult; testReport: TestReportState; testArtifact: ArtifactStoreState }>) => {
      store = mockStore;
      store.setState({
        app: initialAppResultState,
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
        app: {
          slug: 'test-slug',
          name: 'Test name'
        },
        testReport: {
          ...initialtestReportsState,
          testReports: [testReport]
        },
        testArtifact: {
          testArtifacts: Array(3)
            .fill(null)
            .map(() => new TestArtifact())
        }
      });

      fixture.detectChanges();
    });

    it('renders as many test artifact items as there are test artifacts', () => {
      expect(fixture.debugElement.queryAll(By.css('.test-artifact')).length).toBe(3);
    });
  });

  describe('downloadAll', () => {
    const testArtifacts = [
      new TestArtifact().deserialize({ filename: 'file-1', downloadURL: ' download-url-1' }),
      new TestArtifact().deserialize({ filename: 'file-2', downloadURL: ' download-url-2' })
    ];
    beforeEach(() => {
      testArtifactsComponent.suiteName = 'whatever';
      store.setState({
        app: {
          slug: 'test-slug',
          name: 'Test name'
        },
        testReport: {
          ...initialtestReportsState,
          testReports: [testReport]
        },
        testArtifact: { testArtifacts }
      });

      fixture.detectChanges();
    });

    it('calls zipper with the screenshots', async () => {
      testArtifactsComponent.suiteName = 'Some Device';
      const promise = testArtifactsComponent.downloadAll();
      const expectedFiles = testArtifacts.map(({ filename, downloadURL: url }) => ({ filename, url }));
      expect(zipper.zipFilesFromUrls).toHaveBeenCalledWith(expectedFiles, 'some-device-test-artifacts');
      await promise;
    });
  });
});
