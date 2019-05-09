import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestSuiteComponent } from './test-suite.component';
import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite, TestSuiteStatus } from '../../models/test-suite.model';
import { TestCase, TestCaseStatus } from '../../models/test-case.model';

@Pipe({ name: 'textFromDurationInMilliseconds' })
class MockTextFromDurationInMilliseconds implements PipeTransform {
  transform(durationInMilliseconds: number): string {
    return '1 sec';
  }
}

describe('TestSuiteComponent', () => {
  let fixture: ComponentFixture<TestSuiteComponent>;
  let testSuiteComponent: TestSuiteComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, InlineSVGModule.forRoot()],
      declarations: [MockTextFromDurationInMilliseconds, TestSuiteComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSuiteComponent);
    testSuiteComponent = fixture.debugElement.componentInstance;
    testSuiteComponent.testReport = new TestReport();
    testSuiteComponent.testReport.testSuites = [new TestSuite()];
    testSuiteComponent.testSuite = testSuiteComponent.testReport.testSuites[0];
  });

  it('creates the test suite component', () => {
    expect(testSuiteComponent).not.toBeNull();
  });

  describe('when test suite only has passed test cases', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite.status = TestSuiteStatus.passed;
      testSuiteComponent.testSuite.testCases = Array(3)
        .fill(null)
        .map(() => new TestCase());
      testSuiteComponent.testSuite.testCases[0].status = TestCaseStatus.passed;
      testSuiteComponent.testSuite.testCases[1].status = TestCaseStatus.passed;
      testSuiteComponent.testSuite.testCases[2].status = TestCaseStatus.passed;

      fixture.detectChanges();
    });

    it('renders a bar for passed status', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed'))).not.toBeNull();
    });

    it('related bar has passed test case count as content', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed')).nativeElement.textContent).toBe('3');
    });

    it('does not render a bar for failed status', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.failed'))).toBeNull();
    });

    it('renders a visible "Test cases" button', () => {
      expect(fixture.debugElement.query(By.css('.test-cases-button[hidden]'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.test-cases-button'))).not.toBeNull();
    });
  });

  describe('when test suite only has failed test cases', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite.status = TestSuiteStatus.failed;
      testSuiteComponent.testSuite.testCases = Array(3)
        .fill(null)
        .map(() => new TestCase());
      testSuiteComponent.testSuite.testCases[0].status = TestCaseStatus.failed;
      testSuiteComponent.testSuite.testCases[1].status = TestCaseStatus.failed;
      testSuiteComponent.testSuite.testCases[2].status = TestCaseStatus.failed;

      fixture.detectChanges();
    });

    it('renders a bar for failed status', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.failed'))).not.toBeNull();
    });

    it('related bar has failed test case count as content', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.failed')).nativeElement.textContent).toBe('3');
    });

    it('does not render a bar for passed status', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed'))).toBeNull();
    });

    it('renders a visible "Test cases" button', () => {
      expect(fixture.debugElement.query(By.css('.test-cases-button[hidden]'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.test-cases-button'))).not.toBeNull();
    });
  });

  describe('when test suite only has skipped test cases', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite.status = TestSuiteStatus.passed;
      testSuiteComponent.testSuite.testCases = Array(3)
        .fill(null)
        .map(() => new TestCase());
      testSuiteComponent.testSuite.testCases[0].status = TestCaseStatus.skipped;
      testSuiteComponent.testSuite.testCases[1].status = TestCaseStatus.skipped;
      testSuiteComponent.testSuite.testCases[2].status = TestCaseStatus.skipped;

      fixture.detectChanges();
    });

    it('renders a bar for skipped status', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.skipped'))).not.toBeNull();
    });

    it('related bar has skipped test case count as content', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.skipped')).nativeElement.textContent).toBe('3');
    });

    it('does not render a bar for passed status', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed'))).toBeNull();
    });

    it('renders a visible "Test cases" button', () => {
      expect(fixture.debugElement.query(By.css('.test-cases-button[hidden]'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.test-cases-button'))).not.toBeNull();
    });
  });

  describe('when test suite has passed, failed, and skipped test cases', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite.status = TestSuiteStatus.failed;
      testSuiteComponent.testSuite.testCases = Array(4)
        .fill(null)
        .map(() => new TestCase());
      testSuiteComponent.testSuite.testCases[0].status = TestCaseStatus.passed;
      testSuiteComponent.testSuite.testCases[1].status = TestCaseStatus.failed;
      testSuiteComponent.testSuite.testCases[2].status = TestCaseStatus.failed;
      testSuiteComponent.testSuite.testCases[3].status = TestCaseStatus.skipped;

      fixture.detectChanges();
    });

    it('renders bars for both status', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.test-case-bar.failed'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.test-case-bar.skipped'))).not.toBeNull();
    });

    it('bars have test case count as content', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed')).nativeElement.textContent).toBe('1');
      expect(fixture.debugElement.query(By.css('.test-case-bar.failed')).nativeElement.textContent).toBe('2');
      expect(fixture.debugElement.query(By.css('.test-case-bar.skipped')).nativeElement.textContent).toBe('1');
    });

    it('renders a visible "Test cases" button', () => {
      expect(fixture.debugElement.query(By.css('.test-cases-button[hidden]'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.test-cases-button'))).not.toBeNull();
    });
  });

  describe('when test suite is in progress', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite.status = TestSuiteStatus.inProgress;

      fixture.detectChanges();
    });

    it('renders a bar', () => {
      expect(fixture.debugElement.query(By.css('.test-result-bar'))).not.toBeNull();
    });

    it('does not render a bar for passed and failed statuses', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.test-case-bar.failed'))).toBeNull();
    });

    it('renders a "Test cases" button, but hidden', () => {
      expect(fixture.debugElement.query(By.css('.test-cases-button[hidden]'))).not.toBeNull();
    });
  });

  describe('when test suite is inconclusive', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite.status = TestSuiteStatus.inconclusive;

      fixture.detectChanges();
    });

    it('renders a bar', () => {
      expect(fixture.debugElement.query(By.css('.test-result-bar'))).not.toBeNull();
    });

    it('does not render a bar for passed and failed statuses', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.test-case-bar.failed'))).toBeNull();
    });

    it('renders a "Test cases" button, but hidden', () => {
      expect(fixture.debugElement.query(By.css('.test-cases-button[hidden]'))).not.toBeNull();
    });
  });

  describe('when test suite is skipped', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite.status = TestSuiteStatus.skipped;

      fixture.detectChanges();
    });

    it('renders a bar', () => {
      expect(fixture.debugElement.query(By.css('.test-result-bar'))).not.toBeNull();
    });

    it('does not render a bar for passed and failed statuses', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.test-case-bar.failed'))).toBeNull();
    });

    it('renders a "Test cases" button, but hidden', () => {
      expect(fixture.debugElement.query(By.css('.test-cases-button[hidden]'))).not.toBeNull();
    });
  });
});
