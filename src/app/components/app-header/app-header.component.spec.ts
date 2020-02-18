import { TestBed, async, ComponentFixture, fakeAsync, tick, inject } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Pipe, PipeTransform, DebugElement, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { InlineSVGModule } from 'ng-inline-svg';

import { AppHeaderComponent, HORIZONTAL_LAYOUT_REPORT_LIMIT } from './app-header.component';
import { TestReport } from '../../models/test-report.model';
import { ReportsReducer, TestReportState } from 'src/app/store/reports/reducer';
import { TestSuite } from '../../models/test-suite.model';
import { MockStore, provideMockStore } from 'src/app/mock-store/testing';
import { initialState } from 'src/app/store/reports/reducer.spec';

@Component({
  selector: 'bitrise-test-summary',
  template: ''
})
class MockTestSummaryComponent {}

@Component({
  selector: 'bitrise-test-report',
  template: ''
})
class MockTestReportComponent {}

@Pipe({ name: 'maximizeTo' })
class MockMaximizePipe implements PipeTransform {
  transform(value: number, maximumValue: number, maximumReachedPostfixCharacter: string): string {
    return '9+';
  }
}

const generateTestReports = (length: number): TestReport[] =>
  Array.from(
    { length },
    (_, key) => ({
      id: key + 1,
      name: `UI Test ${String.fromCharCode('A'.charCodeAt(0) + key)}`,
      failedTestSuiteCount: key
    })).map((specConfig) => {
      const testReport = new TestReport();
      testReport.id = specConfig.id.toString();
      testReport.name = specConfig.name;
      testReport.testSuites = Array(specConfig.failedTestSuiteCount)
        .fill(null)
        .map(() => {
          const testSuite = new TestSuite();
          testSuite.status = 2;

          return testSuite;
        });

      return testReport;
    });

describe('AppHeaderComponent', () => {
  let location: Location;
  let store: MockStore<{ testReport: TestReportState }>;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let appHeaderElement: AppHeaderComponent;
  let tabElements: DebugElement[];
  let summedFailedTestCountElement: DebugElement;
  let dropdownItemElements: DebugElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ testReport: ReportsReducer }),
        RouterTestingModule.withRoutes([
          { path: 'builds/:buildSlug/summary', component: MockTestSummaryComponent },
          { path: 'builds/:buildSlug/testreport/1', component: MockTestReportComponent },
          { path: 'builds/:buildSlug/testreport/2', component: MockTestReportComponent },
          { path: 'builds/:buildSlug/testreport/3', component: MockTestReportComponent }
        ]),
        HttpClientTestingModule,
        FormsModule,
        InlineSVGModule.forRoot()
      ],
      providers: [provideMockStore({})],
      declarations: [MockMaximizePipe, AppHeaderComponent, MockTestSummaryComponent, MockTestReportComponent]
    }).compileComponents();
  }));

  beforeEach(inject([Store], (mockStore: MockStore<{ testReport: TestReportState }>) => {
    store = mockStore;
    store.setState({
      testReport: {
        testReports: [],
        filteredReports: [],
        isLoading: false,
        filter: null
      }
    });
  }));

  beforeEach(() => {
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppHeaderComponent);
    appHeaderElement = fixture.debugElement.componentInstance;
    appHeaderElement.buildSlug = 'build-slug';
  });

  it('creates the app header', () => {
    expect(appHeaderElement).not.toBeNull();
  });

  describe('when there are some test reports', () => {
    beforeEach(() => {
      store.setState({
        testReport: {
          filteredReports: [],
          filter: null,
          isLoading: true,
          testReports: generateTestReports(HORIZONTAL_LAYOUT_REPORT_LIMIT - 1)
        }
      });

      fixture.componentInstance.selectedStatus = null;
      fixture.detectChanges();

      tabElements = fixture.debugElement.queryAll(By.css('a.tabmenu-item'));
      summedFailedTestCountElement = fixture.debugElement.query(By.css('.summed-failed-test-count'));
      dropdownItemElements = fixture.debugElement.queryAll(By.css('.tabmenu-dropdown option'));
    });

    it('loads as many tabs (and items for the mobile-only dropdown) as there are test reports, plus one for the summary', () => {
      expect(tabElements.length).toBe(5);
      expect(dropdownItemElements.length).toBe(5);
    });

    it(`only uses vertical layout with less than ${HORIZONTAL_LAYOUT_REPORT_LIMIT} reports`, () => {
      expect(fixture.componentInstance.isVerticalLayout).toBeTruthy();

      store.setState({
        testReport: {
          filteredReports: [],
          filter: null,
          isLoading: true,
          testReports: generateTestReports(HORIZONTAL_LAYOUT_REPORT_LIMIT)
        }
      });

      fixture.detectChanges();
      expect(fixture.componentInstance.isVerticalLayout).toBeFalsy();
    });

    it('shows the name of the test reports in the tabs (and in the items of the mobile-only dropdown)', () => {
      expect(tabElements[1].query(By.css('.text')).nativeElement.textContent).toBe('UI Test A');
      expect(tabElements[2].query(By.css('.text')).nativeElement.textContent).toBe('UI Test B');
      expect(tabElements[3].query(By.css('.text')).nativeElement.textContent).toBe('UI Test C');
      expect(tabElements[4].query(By.css('.text')).nativeElement.textContent).toBe('UI Test D');

      expect(dropdownItemElements[1].nativeElement.textContent).toBe('UI Test A');
      expect(dropdownItemElements[2].nativeElement.textContent).toBe('UI Test B');
      expect(dropdownItemElements[3].nativeElement.textContent).toBe('UI Test C');
      expect(dropdownItemElements[4].nativeElement.textContent).toBe('UI Test D');
    });

    it('shows bubble only for test reports with failed tests', () => {
      expect(tabElements[1].query(By.css('.notification-bubble'))).toBeNull();
      expect(tabElements[2].query(By.css('.notification-bubble'))).not.toBeNull();
    });

    it('shows the sum of failed tests in the mobile-only section', () => {
      expect(summedFailedTestCountElement.query(By.css('.text')).nativeElement.textContent).toBe('6 failed tests');
    });

    describe('and a test report tab is selected', () => {
      let selectedTabElement: DebugElement;

      beforeEach(fakeAsync(() => {
        selectedTabElement = fixture.debugElement.queryAll(By.css('.tabmenu-item'))[2];
        selectedTabElement.nativeElement.click();
      }));

      it('directs to corresponding route', fakeAsync(() => {
        tick();

        expect(location.path()).toBe('/builds/build-slug/testreport/2');
      }));
    });

    describe('and passed is selected in the global status filter', () => {
      let globalFilterElement: DebugElement;

      beforeEach(fakeAsync(() => {
        globalFilterElement = fixture.debugElement.query(By.css('.status-select'));
        globalFilterElement.nativeElement.value = globalFilterElement.nativeElement.options[2].value;
        globalFilterElement.nativeElement.dispatchEvent(new Event('change'));

        tick();
      }));

      it('calls selectedStatusChanged', () => {
        spyOn(appHeaderElement, 'selectedStatusChanged');

        globalFilterElement.nativeElement.value = globalFilterElement.nativeElement.options[2].value;
        globalFilterElement.nativeElement.dispatchEvent(new Event('change'));

        expect(appHeaderElement.selectedStatusChanged).toHaveBeenCalled();
      });

      it('sets status passed as query parameter', () => {
        expect(location.path()).toContain('status=passed');
      });
    });

    describe('and a dropdown item is selected', () => {
      let dropdownElement: DebugElement;

      beforeEach(() => {
        dropdownElement = fixture.debugElement.query(By.css('.tabmenu-dropdown'));
        dropdownElement.nativeElement.value = dropdownElement.nativeElement.options[0].value;
        dropdownElement.nativeElement.dispatchEvent(new Event('change'));
      });

      it('calls selectedSmallTabmenuItemChanged', () => {
        spyOn(appHeaderElement, 'selectedSmallTabmenuItemChanged');

        dropdownElement.nativeElement.value = dropdownElement.nativeElement.options[1].value;
        dropdownElement.nativeElement.dispatchEvent(new Event('change'));

        expect(appHeaderElement.selectedSmallTabmenuItemChanged).toHaveBeenCalled();
      });

      it('directs to corresponding route', fakeAsync(() => {
        dropdownElement.nativeElement.value = dropdownElement.nativeElement.options[1].value;
        dropdownElement.nativeElement.dispatchEvent(new Event('change'));

        tick();

        expect(location.path()).toBe('/builds/build-slug/testreport/1');
      }));
    });
  });

  describe('when there are no test reports', () => {
    beforeEach(() => {
      store.setState({
        testReport: initialState
      });

      fixture.detectChanges();

      tabElements = fixture.debugElement.queryAll(By.css('a.tabmenu-item'));
      summedFailedTestCountElement = fixture.debugElement.query(By.css('.summed-failed-test-count'));
      dropdownItemElements = fixture.debugElement.queryAll(By.css('.tabmenu-dropdown option'));
    });

    it('loads only one tab for the summary', () => {
      expect(tabElements.length).toBe(1);
    });

    it('does not show mobile-only dropdown)', () => {
      expect(summedFailedTestCountElement).toBeNull();
      expect(dropdownItemElements.length).toBe(0);
    });
  });
});
