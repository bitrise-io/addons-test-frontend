import { Component, Input } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestReportComponent } from './test-report.component';
import { TestReport } from '../../models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';

@Component({
  selector: 'bitrise-test-suite',
  template: ''
})
class MockTestSuiteComponent {
  @Input() buildSlug: string;
  @Input() testReport: TestReport;
  @Input() testSuite: TestSuite;
}

@Component({
  selector: 'bitrise-heading-text',
  template: ''
})
class MockHeadingTextComponent {
}

describe('TestReportComponent', () => {
  let fixture: ComponentFixture<TestReportComponent>;
  let testReportComponent: TestReportComponent;
  let testReport: TestReport;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, InlineSVGModule.forRoot()],
      declarations: [TestReportComponent, MockTestSuiteComponent, MockHeadingTextComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestReportComponent);
    testReportComponent = fixture.debugElement.componentInstance;
    testReportComponent.testReport = testReport = new TestReport();
  });

  it('creates the test report component', () => {
    expect(testReportComponent).not.toBeNull();
  });

  describe('when test report has some test suites', () => {
    beforeEach(() => {
      (testReport.testSuites = Array(3)
        .fill(null)
        .map(() => new TestSuite())),
        fixture.detectChanges();
    });

    it('renders that many test suite components', () => {
      expect(fixture.debugElement.queryAll(By.css('bitrise-test-suite')).length).toBe(3);
    });

    it('does not render no items element', () => {
      expect(fixture.debugElement.query(By.css('.no-test-suites'))).toBeNull();
    });
  });

  describe('when test report does not have test suites', () => {
    beforeEach(() => {
      testReport.testSuites = [];

      fixture.detectChanges();
    });

    it('does not render test suite components', () => {
      expect(fixture.debugElement.query(By.css('bitrise-test-suite'))).toBeNull();
    });

    it('renders no items element', () => {
      expect(fixture.debugElement.query(By.css('.no-test-suites'))).not.toBeNull();
    });
  });
});
