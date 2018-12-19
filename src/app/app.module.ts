import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { appRoutes } from './routes';
import { MaximizePipe } from './maximize.pipe';
import { TextFromDurationInMilliseconds } from './text-from-duration-in-milliseconds.pipe';
import { TestSummaryComponent } from './test-summary.component';
import { TestSummaryHeaderComponent } from './test-summary-header.component';
import { TestReportComponent } from './test-report.component';
import { TestReportService } from './test-report.service';
import { testReportReducer } from './test-report.reducer';
import { TestSuiteComponent } from './test-suite.component';
import { TestCaseComponent } from './test-case.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    MaximizePipe,
    TextFromDurationInMilliseconds,
    TestSummaryComponent,
    TestSummaryHeaderComponent,
    TestReportComponent,
    TestSuiteComponent,
    TestCaseComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({ testReport: testReportReducer }),
    InlineSVGModule.forRoot()
  ],
  providers: [TestReportService],
  bootstrap: [AppComponent]
})
export class AppModule {}
