import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { StoreModule } from '@ngrx/store';

import { appRoutes } from './routes';
import { MaximizePipe } from './pipes/maximize.pipe';
import { TextFromDurationInMilliseconds } from './pipes/text-from-duration-in-milliseconds.pipe';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { testReportStoreReducer } from './components/test-report/test-report.store';
import { TestSummaryComponent } from './components/test-summary/test-summary.component';
import { TestSummaryHeaderComponent } from './components/test-summary-header/test-summary-header.component';
import { TestReportComponent } from './components/test-report/test-report.component';
import { TestSuiteComponent } from './components/test-suite/test-suite.component';
import { TestCaseComponent } from './components/test-case/test-case.component';
import { TestSuiteDetailsComponent } from './components/test-suite-details/test-suite-details.component';
import { environment } from 'src/environments/environment';
import { TestSuiteDetailsHeaderComponent } from './components/test-suite-details-header/test-suite-details-header.component';
import { TestSuiteDetailsMenuTestCasesComponent } from './components/test-suite-details/menu/test-cases/test-suite-details-menu-test-cases.component';
import { TestSuiteDetailsMenuPerformanceComponent } from './components/test-suite-details/menu/performance/test-suite-details-menu-performance.component';
import { TestSuiteDetailsMenuVideoComponent } from './components/test-suite-details/menu/video/test-suite-details-menu-video.component';
import { TestSuiteDetailsMenuScreenshotsComponent } from './components/test-suite-details/menu/screenshots/test-suite-details-menu-screenshots.component';
import { TestSuiteDetailsMenuTestArtifactsComponent } from './components/test-suite-details/menu/testartifacts/test-suite-details-menu-test-artifacts.component';
import { TestSuiteDetailsMenuLogsComponent } from './components/test-suite-details/menu/logs/test-suite-details-menu-logs.component';

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
    TestCaseComponent,
    TestSuiteDetailsComponent,
    TestSuiteDetailsHeaderComponent,
    TestSuiteDetailsMenuTestCasesComponent,
    TestSuiteDetailsMenuPerformanceComponent,
    TestSuiteDetailsMenuVideoComponent,
    TestSuiteDetailsMenuScreenshotsComponent,
    TestSuiteDetailsMenuTestArtifactsComponent,
    TestSuiteDetailsMenuLogsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({ testReport: testReportStoreReducer }),
    InlineSVGModule.forRoot(),
    environment.ServicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
