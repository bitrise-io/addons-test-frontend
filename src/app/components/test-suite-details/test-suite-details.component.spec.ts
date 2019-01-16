import { Component, Input } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { TestSuite } from 'src/app/models/test-suite.model';
import { TestSuiteDetailsComponent } from './test-suite-details.component';
import { testReportStoreReducer } from '../test-report/test-report.store';

@Component({
  selector: 'bitrise-test-suite-details-header',
  template: ''
})
class MockTestSuiteDetailsHeaderComponent {
  @Input() testSuite: TestSuite;
  @Input() previousTestSuite: TestSuite;
  @Input() nextTestSuite: TestSuite;
}

describe('TestSuiteDetailsComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsComponent>;
  let testSuiteDetailsComponent: TestSuiteDetailsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, StoreModule.forRoot({ testReport: testReportStoreReducer })],
      declarations: [TestSuiteDetailsComponent, MockTestSuiteDetailsHeaderComponent],
      providers: []
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuiteDetailsComponent);
    testSuiteDetailsComponent = fixture.debugElement.componentInstance;

    fixture.detectChanges();
  });

  it('creates the test suite details component', () => {
    expect(testSuiteDetailsComponent).not.toBeNull();
  });
});
