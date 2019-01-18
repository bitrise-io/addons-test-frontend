import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestSuiteDetailsHeaderComponent } from './test-suite-details-header.component';

describe('TestSuiteDetailsHeaderComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsHeaderComponent>;
  let testSuiteDetailsHeaderComponent: TestSuiteDetailsHeaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestSuiteDetailsHeaderComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSuiteDetailsHeaderComponent);
    testSuiteDetailsHeaderComponent = fixture.debugElement.componentInstance;
  });

  it('creates the test suite details component', () => {
    expect(testSuiteDetailsHeaderComponent).not.toBeNull();
  });
});
