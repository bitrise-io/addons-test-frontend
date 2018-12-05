import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { Pipe, PipeTransform, DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { AppHeaderComponent } from './app-header.component';
import { TestSummaryComponent } from './test-summary.component';
import { TestSuiteComponent } from './test-suite.component';
import { TestSuiteService } from './test-suite.service';

@Pipe({ name: 'maximizeTo' })
class MockMaximizePipe implements PipeTransform {
  transform(value: number, maximumValue: number, maximumReachedPostfixCharacter: string): string {
    return '9+';
  }
}

class MockTestSuiteService {
  testSuites: any[];

  public getTestSuites(): any[] {
    return this.testSuites;
  }
}

describe('AppHeaderComponent', () => {
  let location: Location;
  let service: MockTestSuiteService;
  let fixture: ComponentFixture<AppHeaderComponent>;
  let appHeaderElement: AppHeaderComponent;
  let tabElements: DebugElement[];
  let summedTestCaseCountElement: DebugElement;
  let dropdownItemElements: DebugElement[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'summary', component: TestSummaryComponent },
          { path: 'testsuite/1', component: TestSuiteComponent },
          { path: 'testsuite/2', component: TestSuiteComponent },
          { path: 'testsuite/3', component: TestSuiteComponent }
        ]),
        HttpClientTestingModule,
        FormsModule,
        InlineSVGModule.forRoot()
      ],
      declarations: [MockMaximizePipe, AppHeaderComponent, TestSummaryComponent, TestSuiteComponent],
      providers: [{ provide: TestSuiteService, useClass: MockTestSuiteService }]
    }).compileComponents();

    service = TestBed.get(TestSuiteService);
  }));

  beforeEach(() => {
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppHeaderComponent);
    appHeaderElement = fixture.debugElement.componentInstance;
  });

  it('creates the app header', () => {
    expect(appHeaderElement).not.toBeNull();
  });

  describe('when there are some test suites', () => {
    beforeEach(() => {
      service.testSuites = [
        { id: 1, name: 'Unit Test A', failedTestCaseCount: 2 },
        { id: 2, name: 'Unit Test X', failedTestCaseCount: 0 },
        { id: 3, name: 'Unit Test Y', failedTestCaseCount: 1 }
      ];

      fixture.detectChanges();

      tabElements = fixture.debugElement.queryAll(By.css('a.tabmenu-item'));
      summedTestCaseCountElement = fixture.debugElement.query(By.css('.summed-failed-test-case-count'));
      dropdownItemElements = fixture.debugElement.queryAll(By.css('.tabmenu-select option'));
    });

    it('loads as many tabs as there are test suites, plus one for the summary', () => {
      expect(tabElements.length).toBe(4);
    });

    it('shows the name of the test suites in the tabs', () => {
      expect(tabElements[1].query(By.css('.text')).nativeElement.textContent).toBe('Unit Test A');
      expect(tabElements[2].query(By.css('.text')).nativeElement.textContent).toBe('Unit Test X');
      expect(tabElements[3].query(By.css('.text')).nativeElement.textContent).toBe('Unit Test Y');
    });

    it('shows bubble for test suites with failed test cases', () => {
      expect(tabElements[1].query(By.css('.notification-bubble'))).not.toBeNull();
      expect(tabElements[3].query(By.css('.notification-bubble'))).not.toBeNull();
    });

    it('does not show bubble for test suites without failed test cases', () => {
      expect(tabElements[2].query(By.css('.notification-bubble'))).toBeNull();
    });

    it('shows the sum of failed test cases in the mobile-only section', () => {
      expect(summedTestCaseCountElement.query(By.css('.text')).nativeElement.textContent).toBe('3 failed tests');
    });

    it('loads as many items for the mobile-only dropdown as there are test suites, plus one for the summary', () => {
      expect(dropdownItemElements.length).toBe(4);
    });

    it('shows the name of the test suites in the dropdown items', () => {
      expect(dropdownItemElements[1].nativeElement.textContent).toBe('Unit Test A');
      expect(dropdownItemElements[2].nativeElement.textContent).toBe('Unit Test X');
      expect(dropdownItemElements[3].nativeElement.textContent).toBe('Unit Test Y');
    });

    describe('and a test suite tab is selected', () => {
      let selectedTabElement: DebugElement;

      beforeEach(fakeAsync(() => {
        selectedTabElement = fixture.debugElement.queryAll(By.css('.tabmenu-item'))[2];
        selectedTabElement.nativeElement.click();
      }));

      it('directs to corresponding route', fakeAsync(() => {
        tick();

        expect(location.path()).toBe('/testsuite/2');
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

        expect(location.path()).toBe('/testsuite/1');
      }));
    });
  });

  describe('when there are no test suites', () => {
    beforeEach(() => {
      service.testSuites = [];

      fixture.detectChanges();

      tabElements = fixture.debugElement.queryAll(By.css('a.tabmenu-item'));
      summedTestCaseCountElement = fixture.debugElement.query(By.css('.summed-failed-test-case-count'));
      dropdownItemElements = fixture.debugElement.queryAll(By.css('.tabmenu-select option'));
    });

    it('loads only one tab for the summary', () => {
      expect(tabElements.length).toBe(1);
    });

    it('shows 0 failed test cases in the mobile-only section', () => {
      expect(summedTestCaseCountElement.query(By.css('.text')).nativeElement.textContent).toBe('0 failed tests');
    });

    it('loads only one dropdown item for the summary', () => {
      expect(dropdownItemElements.length).toBe(1);
    });
  });
});
