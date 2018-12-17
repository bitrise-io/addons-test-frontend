import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestCaseComponent } from './test-case.component';
import { TestCase } from './test-case.model';

@Pipe({ name: 'textFromDurationInMilliseconds' })
class MockTextFromDurationInMilliseconds implements PipeTransform {
  transform(durationInMilliseconds: number): string {
    return '1 sec';
  }
}

describe('TestCaseComponent', () => {
  let fixture: ComponentFixture<TestCaseComponent>;
  let testCaseComponent: TestCaseComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, InlineSVGModule.forRoot()],
      declarations: [MockTextFromDurationInMilliseconds, TestCaseComponent],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCaseComponent);
    testCaseComponent = fixture.debugElement.componentInstance;
    testCaseComponent.testCase = new TestCase();
  });

  it('creates the test case component', () => {
    expect(testCaseComponent).not.toBeNull();
  });

  describe('when show more button is selected', () => {
    beforeEach(() => {
      fixture.debugElement.query(By.css(`.show-more-button`)).nativeElement.click();
      fixture.detectChanges();
    });

    it('renders test case summary', () => {
      expect(fixture.debugElement.query(By.css(`.summary`))).not.toBeNull();
    });

    describe('and then selected again', () => {
      beforeEach(() => {
        fixture.debugElement.query(By.css(`.show-more-button`)).nativeElement.click();
        fixture.detectChanges();
      });

      it('removes test case summary', () => {
        expect(fixture.debugElement.query(By.css(`.summary`))).toBeNull();
      });
    });
  });
});
