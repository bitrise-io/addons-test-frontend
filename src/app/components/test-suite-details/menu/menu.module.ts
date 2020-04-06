import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { TestSuiteDetailsMenuTestCasesComponent } from './test-cases/test-suite-details-menu-test-cases.component';
import { TestSuiteDetailsMenuPerformanceComponent } from './performance/test-suite-details-menu-performance.component';
import { TestSuiteDetailsMenuVideoComponent } from './video/test-suite-details-menu-video.component';
import { TestSuiteDetailsMenuScreenshotsComponent } from './screenshots/test-suite-details-menu-screenshots.component';
import { TestSuiteDetailsMenuTestArtifactsComponent } from './testartifacts/test-suite-details-menu-test-artifacts.component';
import { TestSuiteDetailsMenuLogsComponent } from './logs/test-suite-details-menu-logs.component';
import { HeadingTextComponent } from '../../heading-text/heading-text.component';
import { TestCaseComponent } from '../../test-case/test-case.component';
import { TextFromDurationInMilliseconds } from 'src/app/pipes/text-from-duration-in-milliseconds.pipe';
import { PlaybackTimePipe } from 'src/app/pipes/playback-time.pipe';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    InlineSVGModule.forRoot(),
    VirtualScrollerModule
  ],
  providers: [DatePipe],
  declarations: [
    TextFromDurationInMilliseconds,
    PlaybackTimePipe,
    HeadingTextComponent,
    TestCaseComponent,
    TestSuiteDetailsMenuTestCasesComponent,
    TestSuiteDetailsMenuPerformanceComponent,
    TestSuiteDetailsMenuVideoComponent,
    TestSuiteDetailsMenuScreenshotsComponent,
    TestSuiteDetailsMenuTestArtifactsComponent,
    TestSuiteDetailsMenuLogsComponent
  ],
  exports: [HeadingTextComponent, TestCaseComponent, TextFromDurationInMilliseconds]
})
export class TestSuiteDetailsMenuModule {}
