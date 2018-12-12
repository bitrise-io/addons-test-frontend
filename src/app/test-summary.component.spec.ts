import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestSummaryComponent } from './test-summary.component';

@Component({
  selector: 'bitrise-test-summary-header',
  template: ''
})
class MockTestSummaryHeaderComponent {}

describe('TestSummaryComponent', () => {
  let fixture: ComponentFixture<TestSummaryComponent>;
  let testSummary: TestSummaryComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InlineSVGModule.forRoot()],
      declarations: [TestSummaryComponent, MockTestSummaryHeaderComponent]
    }).compileComponents();
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
});
