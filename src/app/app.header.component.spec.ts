import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { AppHeaderComponent } from './app-header.component';
import { TestSuiteService } from './test-suite.service';

@Pipe({ name: 'maximizeTo' })
class MockMaximizePipe implements PipeTransform {
  transform(value: number, maximumValue: number, maximumReachedPostfixCharacter: string): string {
    return '9+';
  }
}

class MockTestSuiteService {
  public getTestSuites(): any[] {
    return [
      { id: 1, name: 'Unit Test A', failedTestCaseCount: 2 },
      { id: 2, name: 'Unit Test X', failedTestCaseCount: 0 },
      { id: 3, name: 'Unit Test Y', failedTestCaseCount: 1 }
    ];
  }
}

describe('AppHeaderComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, InlineSVGModule.forRoot()],
      declarations: [MockMaximizePipe, AppHeaderComponent],
      providers: [{ provide: TestSuiteService, useClass: MockTestSuiteService }]
    }).compileComponents();
  }));

  it('creates the app header', async(() => {
    const fixture = TestBed.createComponent(AppHeaderComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).not.toBeNull();
  }));
});
