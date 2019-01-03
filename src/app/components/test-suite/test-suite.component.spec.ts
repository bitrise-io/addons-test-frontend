import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestSuiteComponent } from './test-suite.component';
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
      imports: [HttpClientTestingModule, InlineSVGModule.forRoot()],
      declarations: [MockTextFromDurationInMilliseconds, TestSuiteComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSuiteComponent);
    testSuiteComponent = fixture.debugElement.componentInstance;
  });

  it('creates the test suite component', () => {
    expect(testSuiteComponent).not.toBeNull();
  });

  describe('when test suite only has passed test cases', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite = new TestSuite();
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
  });

  describe('when test suite only has failed test cases', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite = new TestSuite();
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
  });

  describe('when test suite has both passed and failed test cases', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite = new TestSuite();
      testSuiteComponent.testSuite.status = TestSuiteStatus.failed;
      testSuiteComponent.testSuite.testCases = Array(3)
        .fill(null)
        .map(() => new TestCase());
      testSuiteComponent.testSuite.testCases[0].status = TestCaseStatus.passed;
      testSuiteComponent.testSuite.testCases[1].status = TestCaseStatus.failed;
      testSuiteComponent.testSuite.testCases[2].status = TestCaseStatus.failed;

      fixture.detectChanges();
    });

    it('renders bars for both status', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.test-case-bar.failed'))).not.toBeNull();
    });

    it('bars have test case count as content', () => {
      expect(fixture.debugElement.query(By.css('.test-case-bar.passed')).nativeElement.textContent).toBe('1');
      expect(fixture.debugElement.query(By.css('.test-case-bar.failed')).nativeElement.textContent).toBe('2');
    });
  });

  describe('when test suite is not yet finished', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite = new TestSuite();
      testSuiteComponent.testSuite.status = TestSuiteStatus.inconclusive;

      fixture.detectChanges();

      it('renders a bar', () => {
        expect(fixture.debugElement.query(By.css('.test-result-bar'))).not.toBeNull();
      });

      it('does not render a bar for passed and failed statuses', () => {
        expect(fixture.debugElement.query(By.css('.test-case-bar.passed'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.test-case-bar.failed'))).toBeNull();
      });
    });
  });

  describe('when test suite is skipped', () => {
    beforeEach(() => {
      testSuiteComponent.testSuite = new TestSuite();
      testSuiteComponent.testSuite.status = TestSuiteStatus.skipped;

      fixture.detectChanges();

      it('renders a bar', () => {
        expect(fixture.debugElement.query(By.css('.test-result-bar'))).not.toBeNull();
      });

      it('does not render a bar for passed and failed statuses', () => {
        expect(fixture.debugElement.query(By.css('.test-case-bar.passed'))).toBeNull();
        expect(fixture.debugElement.query(By.css('.test-case-bar.failed'))).toBeNull();
      });
    });
  });
});
