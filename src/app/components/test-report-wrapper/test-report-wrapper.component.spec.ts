import { TestBed, async, ComponentFixture, inject, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store';
import { InlineSVGModule } from 'ng-inline-svg';

import { TestReportWrapperComponent } from './test-report-wrapper.component';
import { TestReport } from '../../models/test-report.model';
import { testReportStoreReducer, TestReportStoreState } from '../test-report/test-report.store';
import { Router } from '@angular/router';
import { provideMockStore, MockStore } from 'src/app/mock-store/testing';

@Component({
  selector: 'bitrise-test-report',
  template: ''
})
class MockTestReportComponent {
  @Input() testReport: TestReport;
}

xdescribe('TestReportWrapperComponent', () => {
  let router: Router;
  let store: MockStore<{
    testReport: TestReportStoreState;
  }>;
  let fixture: ComponentFixture<TestReportWrapperComponent>;
  let testReportWrapper: TestReportWrapperComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'testreport/:testReportId',
            component: TestReportWrapperComponent
          }
        ]),
        StoreModule.forRoot({ testReport: testReportStoreReducer }),
        InlineSVGModule.forRoot()
      ],
      declarations: [TestReportWrapperComponent, MockTestReportComponent],
      providers: [provideMockStore({})]
    }).compileComponents();

    router = TestBed.get(Router);
  }));

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportStoreState }>) => {
    store = mockStore;
    store.setState({
      testReport: undefined
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReportWrapperComponent);
    testReportWrapper = fixture.debugElement.componentInstance;
    fixture.detectChanges();

    fixture.ngZone.run(() => router.initialNavigation());
  });

  it('creates the test report wrapper', () => {
    expect(testReportWrapper).not.toBeNull();
  });

  describe('when there are some test reports', () => {
    const testReportIds = [1, 2, 3];

    beforeEach(() => {
      store.setState({
        testReport: {
          filteredReports: [],
          filter: null,
          testReports: testReportIds.map((testReportId: number) => {
            const testReport = new TestReport();
            testReport.id = testReportId;

            return testReport;
          })
        }
      });

      fixture.detectChanges();
    });

    testReportIds.forEach((testReportId: number) => {
      describe(`and test report ${testReportId} is in URL`, () => {
        beforeEach(fakeAsync(() => {
          fixture.ngZone.run(() => router.navigate(['testreport/' + testReportId]));

          tick();

          fixture.detectChanges();
        }));

        it('renders one test report', fakeAsync(() => {
          expect(fixture.debugElement.queryAll(By.css('bitrise-test-report')).length).toBe(1);
        }));

        it(`loads test report with ID ${testReportId}`, fakeAsync(() => {
          expect(testReportWrapper.testReport.id).toEqual(testReportId);
        }));
      });
    });
  });
});
