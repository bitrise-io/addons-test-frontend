import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestSuiteDetailsComponent } from './test-suite-details.component';

describe('TestSuiteDetailsComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsComponent>;
  let testSuiteDetailsComponent: TestSuiteDetailsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestSuiteDetailsComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSuiteDetailsComponent);
    testSuiteDetailsComponent = fixture.debugElement.componentInstance;
  });

  it('creates the test suite details component', () => {
    expect(testSuiteDetailsComponent).not.toBeNull();
  });
});
