import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { InlineSVGModule } from 'ng-inline-svg';
import { of } from 'rxjs';

import { TestSuiteDetailsMenuScreenshotsComponent } from './test-suite-details-menu-screenshots.component';
import { MockStore, provideMockStore } from 'src/app/mock-store/testing';
import { TestReport } from 'src/app/models/test-report.model';
import { TestReportState } from 'src/app/store/reports/reducer';
import { TestSuiteDetailsMenuModule } from '../menu.module';
import { TestSuite } from 'src/app/models/test-suite.model';

describe('TestSuiteDetailsMenuScreenshotsComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsMenuScreenshotsComponent>;
  let component: TestSuiteDetailsMenuScreenshotsComponent;
  let store: MockStore<{
    testReport: TestReportState;
  }>;
  let testReport: TestReport;
  let testSuite: TestSuite;

  const initialtestReportsState = {
    testReports: [],
    filteredReports: [],
    filter: null
  };

  beforeEach(() => {
    testReport = new TestReport();
    testSuite = new TestSuite();
    testReport.testSuites = [testSuite];
    testReport.id = 1;
    testSuite.id = 2;
    testSuite.screenshots = [
      {
        url: 'https://loremflickr.com/425/667',
        filename: 'screenshot-whatever-1.portrait.png'
      },
      {
        url: 'https://loremflickr.com/425/667?1',
        filename: 'screenshot-whatever-2.portrait.png'
      }
    ];
    testSuite.downloadAllScreenshotsURL = 'http://download-all.screen.shots';

    TestBed.configureTestingModule({
      imports: [TestSuiteDetailsMenuModule, InlineSVGModule.forRoot(), HttpClientTestingModule],
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
  });

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
    fixture = TestBed.createComponent(TestSuiteDetailsMenuScreenshotsComponent);
    component = fixture.componentInstance;
    store = mockStore;
    store.setState({
      testReport: initialtestReportsState
    });
    fixture.detectChanges();
  }));

  it('creates the screenshots menu component', () => {
    expect(component).not.toBeNull();
  });

  describe('renders UI correctly', () => {
    beforeEach(() => {
      store.setState({
        testReport: {
          ...initialtestReportsState,
          testReports: [testReport]
        }
      });

      fixture.detectChanges();
    });

    it('has 2 screenshots', () => {
      expect(fixture.debugElement.queryAll(By.css('.screenshots__grid__item')).length).toBe(2);
    });

    it('has a download button for all the screenshots', () => {
      expect(fixture.debugElement.query(By.css('.screenshots__download-all'))).not.toBeNull();
    });
  });
});
