import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestSummaryComponent } from './test-summary.component';
import { TestReportService } from './test-report.service';
import { TestReport } from './test-report.model';

class MockTestReportService {
  testReports: any[];

  public getTestReports(): any[] {
    return this.testReports;
  }
}

@Component({
  selector: 'bitrise-test-summary-header',
  template: ''
})
class MockTestSummaryHeaderComponent {}

@Component({
  selector: 'bitrise-test-report',
  template: ''
})
class MockTestReportComponent {
  @Input() testReport: TestReport;
}

describe('TestSummaryComponent', () => {
  let service: MockTestReportService;
  let fixture: ComponentFixture<TestSummaryComponent>;
  let testSummary: TestSummaryComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InlineSVGModule.forRoot()],
      declarations: [TestSummaryComponent, MockTestSummaryHeaderComponent, MockTestReportComponent],
      providers: [{ provide: TestReportService, useClass: MockTestReportService }]
    }).compileComponents();

    service = TestBed.get(TestReportService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSummaryComponent);
    testSummary = fixture.debugElement.componentInstance;
  });

  it('creates the test summary', () => {
    expect(testSummary).not.toBeNull();
  });

  it('renders test summary header', () => {
    const testSummaryHeader = fixture.debugElement.query(By.css('bitrise-test-summary-header'));
    expect(testSummaryHeader).not.toBeNull();
  });

  describe('when there are some test reports', () => {
    beforeEach(() => {
      service.testReports = [...Array(3)].fill(null).map(() => new TestReport());

      fixture.detectChanges();
    });

    it('renders as many test report components as there are test reports', () => {
      expect(fixture.debugElement.queryAll(By.css('bitrise-test-report')).length).toBe(3);
    });
  });
});
