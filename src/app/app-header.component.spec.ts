import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Pipe, PipeTransform, DebugElement, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { AppHeaderComponent } from './app-header.component';
import { TestReportService } from './test-report.service';
import { TestReport } from './test-report.model';
import { TestSuite } from './test-suite.model';
import { TestCase } from './test-case.model';

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

class MockTestReportService {
  testReports: TestReport[];

  public getTestReports(): TestReport[] {
    return this.testReports;
  }
}

describe('AppHeaderComponent', () => {
  let location: Location;
  let service: MockTestReportService;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let appHeaderElement: AppHeaderComponent;
  let tabElements: DebugElement[];
  let summedFailedTestCountElement: DebugElement;
  let dropdownItemElements: DebugElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'summary', component: MockTestSummaryComponent },
          { path: 'testreport/1', component: MockTestReportComponent },
          { path: 'testreport/2', component: MockTestReportComponent },
          { path: 'testreport/3', component: MockTestReportComponent }
        ]),
        HttpClientTestingModule,
        FormsModule,
        InlineSVGModule.forRoot()
      ],
      declarations: [MockMaximizePipe, AppHeaderComponent, MockTestSummaryComponent, MockTestReportComponent],
      providers: [{ provide: TestReportService, useClass: MockTestReportService }]
    }).compileComponents();

    service = TestBed.get(TestReportService);
  }));

  beforeEach(() => {
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppHeaderComponent);
    appHeaderElement = fixture.debugElement.componentInstance;
  });

  it('creates the app header', () => {
    expect(appHeaderElement).not.toBeNull();
  });

  describe('when there are some test reports', () => {
    beforeEach(() => {
      service.testReports = [
        { id: 1, name: 'UI Test A', failedTestSuiteCount: 2 },
        { id: 2, name: 'UI Test B', failedTestSuiteCount: 0 },
        { id: 3, name: 'UI Test C', failedTestSuiteCount: 1 },
        { id: 4, name: 'Unit Test X', failedTestCaseCount: 3 },
        { id: 5, name: 'Unit Test Y', failedTestCaseCount: 6 }
      ].map(specConfig => {
        const testReport = new TestReport();
        testReport.id = specConfig.id;
        testReport.name = specConfig.name;

        if (specConfig.failedTestSuiteCount !== undefined) {
          testReport.testSuites = Array(specConfig.failedTestSuiteCount)
            .fill(null)
            .map(() => {
              const testSuite = new TestSuite();
              testSuite.status = 2;

              return testSuite;
            });

          return testReport;
        } else {
          testReport.testCases = Array(specConfig.failedTestCaseCount)
            .fill(null)
            .map(() => {
              const testCase = new TestCase();
              testCase.status = 2;

              return testCase;
            });

          return testReport;
        }
      });

      fixture.detectChanges();

      tabElements = fixture.debugElement.queryAll(By.css('a.tabmenu-item'));
      summedFailedTestCountElement = fixture.debugElement.query(By.css('.summed-failed-test-count'));
      dropdownItemElements = fixture.debugElement.queryAll(By.css('.tabmenu-select option'));
    });

    it('loads as many tabs (and items for the mobile-only dropdown) as there are test reports, plus one for the summary', () => {
      expect(tabElements.length).toBe(6);
      expect(dropdownItemElements.length).toBe(6);
    });

    it('shows the name of the test reports in the tabs (and in the items of the mobile-only dropdown)', () => {
      expect(tabElements[1].query(By.css('.text')).nativeElement.textContent).toBe('UI Test A');
      expect(tabElements[2].query(By.css('.text')).nativeElement.textContent).toBe('UI Test B');
      expect(tabElements[3].query(By.css('.text')).nativeElement.textContent).toBe('UI Test C');
      expect(tabElements[4].query(By.css('.text')).nativeElement.textContent).toBe('Unit Test X');
      expect(tabElements[5].query(By.css('.text')).nativeElement.textContent).toBe('Unit Test Y');

      expect(dropdownItemElements[1].nativeElement.textContent).toBe('UI Test A');
      expect(dropdownItemElements[2].nativeElement.textContent).toBe('UI Test B');
      expect(dropdownItemElements[3].nativeElement.textContent).toBe('UI Test C');
      expect(dropdownItemElements[4].nativeElement.textContent).toBe('Unit Test X');
      expect(dropdownItemElements[5].nativeElement.textContent).toBe('Unit Test Y');
    });

    it('shows bubble only for test reports with failed tests', () => {
      expect(tabElements[1].query(By.css('.notification-bubble'))).not.toBeNull();
      expect(tabElements[2].query(By.css('.notification-bubble'))).toBeNull();
      expect(tabElements[3].query(By.css('.notification-bubble'))).not.toBeNull();
      expect(tabElements[4].query(By.css('.notification-bubble'))).not.toBeNull();
      expect(tabElements[5].query(By.css('.notification-bubble'))).not.toBeNull();
    });

    it('shows the sum of failed tests in the mobile-only section', () => {
      expect(summedFailedTestCountElement.query(By.css('.text')).nativeElement.textContent).toBe('12 failed tests');
    });

    describe('and a test report tab is selected', () => {
      let selectedTabElement: DebugElement;

      beforeEach(fakeAsync(() => {
        selectedTabElement = fixture.debugElement.queryAll(By.css('.tabmenu-item'))[2];
        selectedTabElement.nativeElement.click();
      }));

      it('directs to corresponding route', fakeAsync(() => {
        tick();

        expect(location.path()).toBe('/testreport/2');
      }));
    });

    describe('and a dropdown item is selected', () => {
      let dropdownElement: DebugElement;

      beforeEach(() => {
        dropdownElement = fixture.debugElement.query(By.css('.tabmenu-select'));
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

        expect(location.path()).toBe('/testreport/1');
      }));
    });
  });

  describe('when there are no test reports', () => {
    beforeEach(() => {
      service.testReports = [];

      fixture.detectChanges();

      tabElements = fixture.debugElement.queryAll(By.css('a.tabmenu-item'));
      summedFailedTestCountElement = fixture.debugElement.query(By.css('.summed-failed-test-count'));
      dropdownItemElements = fixture.debugElement.queryAll(By.css('.tabmenu-select option'));
    });

    it('loads only one tab for the summary (and for the mobile-only dropdown)', () => {
      expect(tabElements.length).toBe(1);
      expect(dropdownItemElements.length).toBe(1);
    });

    it('shows 0 failed tests in the mobile-only section', () => {
      expect(summedFailedTestCountElement.query(By.css('.text')).nativeElement.textContent).toBe('0 failed tests');
    });
  });
});
