import { TestBed, async, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { from } from 'rxjs';
import { Store, StoreModule } from '@ngrx/store';
import { InlineSVGModule } from 'ng-inline-svg';

import { MockStore } from '../../store.mock';
import { TestReportWrapperComponent } from './test-report-wrapper.component';
import { TestReport } from '../../models/test-report.model';
import { testReportStoreReducer } from '../test-report/test-report.store';

@Component({
  selector: 'bitrise-test-report',
  template: ''
})
class MockTestReportComponent {
  @Input() testReport: TestReport;
}

describe('TestReportWrapperComponent', () => {
  let store: MockStore<{
    testReport: TestReport[];
  }>;
  let fixture: ComponentFixture<TestReportWrapperComponent>;
  let testReportWrapper: TestReportWrapperComponent;
  let activatedRouteParams = from([{}]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({ testReport: testReportStoreReducer }), InlineSVGModule.forRoot()],
      declarations: [TestReportWrapperComponent, MockTestReportComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { params: activatedRouteParams } },
        { provide: Store, useClass: MockStore }
      ]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReport[] }>) => {
    store = mockStore;
    store.setState({
      testReport: undefined
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReportWrapperComponent);
    testReportWrapper = fixture.debugElement.componentInstance;
  });

  it('creates the test report wrapper', () => {
    expect(testReportWrapper).not.toBeNull();
  });

  describe('when there are some test reports', () => {
    const testReportIds = [1, 2, 3];

    beforeEach(() => {
      store.setState({
        testReport: testReportIds.map((testReportId: number) => {
          const testReport = new TestReport();
          testReport.id = testReportId;

          return testReport;
        })
      });

      fixture.detectChanges();
    });

    testReportIds.forEach((testReportId: number) => {
      describe(`and test report ${testReportId} is selected`, () => {
        beforeEach(() => {
          activatedRouteParams = from([{ testReportId: testReportId }]);
        });

        it('renders one test report', () => {
          expect(fixture.debugElement.queryAll(By.css('bitrise-test-report')).length).toBe(1);
        });

        it(`loads test report with ID ${testReportId}`, () => {
          expect(testReportWrapper.testReport.id).toEqual(testReportId);
        });
      });
    });
  });
});
