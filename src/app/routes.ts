import { Routes } from '@angular/router';

import { TestSummaryComponent } from './components/test-summary/test-summary.component';
import { TestReportWrapperComponent } from './components/test-report-wrapper/test-report-wrapper.component';
import { TestSuiteDetailsComponent } from './components/test-suite-details/test-suite-details.component';
import { TestSuiteDetailsMenuTestCasesComponent } from './components/test-suite-details/menu/test-cases/test-suite-details-menu-test-cases.component';
import { TestSuiteDetailsMenuPerformanceComponent } from './components/test-suite-details/menu/performance/test-suite-details-menu-performance.component';
import { TestSuiteDetailsMenuVideoComponent } from './components/test-suite-details/menu/video/test-suite-details-menu-video.component';
import { TestSuiteDetailsMenuScreenshotsComponent } from './components/test-suite-details/menu/screenshots/test-suite-details-menu-screenshots.component';
import { TestSuiteDetailsMenuTestArtifactsComponent } from './components/test-suite-details/menu/testartifacts/test-suite-details-menu-test-artifacts.component';
import { TestSuiteDetailsMenuLogsComponent } from './components/test-suite-details/menu/logs/test-suite-details-menu-logs.component';

export const appRoutes: Routes = [
  { path: 'summary', component: TestSummaryComponent },
  { path: 'testreport/:testReportId', component: TestReportWrapperComponent },
  {
    path: 'testreport/:testReportId/testsuite/:testSuiteId',
    component: TestSuiteDetailsComponent,
    children: [
      { path: 'testcases', component: TestSuiteDetailsMenuTestCasesComponent },
      { path: 'performance', component: TestSuiteDetailsMenuPerformanceComponent },
      { path: 'video', component: TestSuiteDetailsMenuVideoComponent },
      { path: 'screenshots', component: TestSuiteDetailsMenuScreenshotsComponent },
      { path: 'testartifacts', component: TestSuiteDetailsMenuTestArtifactsComponent },
      { path: 'logs', component: TestSuiteDetailsMenuLogsComponent },
      { path: '', redirectTo: 'testcases', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/summary', pathMatch: 'full' }
];
