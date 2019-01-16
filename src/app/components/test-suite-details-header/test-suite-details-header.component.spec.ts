import { Pipe, PipeTransform } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestSuiteDetailsHeaderComponent } from './test-suite-details-header.component';

@Pipe({ name: 'textFromDurationInMilliseconds' })
class MockTextFromDurationInMilliseconds implements PipeTransform {
  transform(durationInMilliseconds: number): string {
    return '1 sec';
  }
}

describe('TestSuiteDetailsHeaderComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsHeaderComponent>;
  let testSuiteDetailsHeaderComponent: TestSuiteDetailsHeaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MockTextFromDurationInMilliseconds, TestSuiteDetailsHeaderComponent],
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
