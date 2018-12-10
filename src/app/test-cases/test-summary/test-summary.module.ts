import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestSummaryComponent } from './test-summary.component';
import { TestSummaryHeaderComponent } from '../test-summary-header/test-summary-header.component';

@NgModule({
  declarations: [
    TestSummaryComponent,
    TestSummaryHeaderComponent,
  ],
  exports: [
    TestSummaryHeaderComponent
  ],
  imports: [
    CommonModule,
  ]
})
export class TestSummaryModule { }
