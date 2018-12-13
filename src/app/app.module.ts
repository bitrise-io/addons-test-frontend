import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { appRoutes } from './routes';
import { MaximizePipe } from './maximize.pipe';
import { CssClassFromTestSuiteStatusPipe } from './css-class-from-test-suite-status.pipe';
import { TestSummaryComponent } from './test-summary.component';
import { TestSummaryHeaderComponent } from './test-summary-header.component';
import { TestReportComponent } from './test-report.component';
import { TestReportService } from './test-report.service';
import { TestSuiteComponent } from './test-suite.component';
import { TextFromDurationInMilliseconds } from './text-from-duration-in-milliseconds.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    MaximizePipe,
    CssClassFromTestSuiteStatusPipe,
    TextFromDurationInMilliseconds,
    TestSummaryComponent,
    TestSummaryHeaderComponent,
    TestReportComponent,
    TestSuiteComponent
  ],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes), HttpClientModule, FormsModule, InlineSVGModule.forRoot()],
  providers: [TestReportService],
  bootstrap: [AppComponent]
})
export class AppModule {}
