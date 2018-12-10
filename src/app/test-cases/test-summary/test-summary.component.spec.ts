import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestSummaryComponent } from './test-summary.component';
import { TestSummaryHeaderComponent } from '../test-summary-header/test-summary-header.component';
import { CommonModule } from '@angular/common';

describe('TestSummaryComponent', () => {
  let component: TestSummaryComponent;
  let fixture: ComponentFixture<TestSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestSummaryComponent,
        TestSummaryHeaderComponent,
      ],
      imports: [
        CommonModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
