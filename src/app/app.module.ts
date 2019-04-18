import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { environment } from 'src/environments/environment';

import { appRoutes } from './routes';
import { MaximizePipe } from './pipes/maximize.pipe';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './components/app-header/app-header.component';
import { AppFooterComponent } from './components/app-footer/app-footer.component';
import { TestSummaryComponent } from './components/test-summary/test-summary.component';
import { TestReportWrapperComponent } from './components/test-report-wrapper/test-report-wrapper.component';
import { TestSummaryHeaderComponent } from './components/test-summary-header/test-summary-header.component';
import { TestReportComponent } from './components/test-report/test-report.component';
import { TestSuiteComponent } from './components/test-suite/test-suite.component';
import { TestSuiteDetailsComponent } from './components/test-suite-details/test-suite-details.component';
import { TestSuiteDetailsHeaderComponent } from './components/test-suite-details-header/test-suite-details-header.component';
import { TestSuiteDetailsMenuModule } from './components/test-suite-details/menu/menu.module';

import artifactsReducer from 'src/app/store/artifacts/reducer';
import reportsReducer from 'src/app/store/reports/reducer';
import performanceReducer from 'src/app/store/performance/reducer';
import logReducer from 'src/app/store/log/reducer';
import { ReportEffects } from 'src/app/store/reports/effects';
import { ArtifactEffects } from 'src/app/store/artifacts/effects';
import { PerformanceEffects } from 'src/app/store/performance/effects';
import { LogEffects } from 'src/app/store/log/effects';
import { TestSuiteResolve } from './services/test-suite.resolve.service';

@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    MaximizePipe,
    TestSummaryComponent,
    TestReportWrapperComponent,
    TestSummaryHeaderComponent,
    TestReportComponent,
    TestSuiteComponent,
    TestSuiteDetailsComponent,
    TestSuiteDetailsHeaderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({
      testReport: reportsReducer,
      testArtifact: artifactsReducer,
      performance: performanceReducer,
      log: logReducer,
    }),
    EffectsModule.forRoot([ReportEffects, ArtifactEffects, PerformanceEffects, LogEffects]),
    InlineSVGModule.forRoot(),
    environment.ServicesModule,
    TestSuiteDetailsMenuModule
  ],
  providers: [TestSuiteResolve],
  bootstrap: [AppComponent]
})
export class AppModule {}
