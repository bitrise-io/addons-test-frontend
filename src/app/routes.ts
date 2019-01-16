import { Routes } from '@angular/router';

import { TestSummaryComponent } from './components/test-summary/test-summary.component';
import { TestReportWrapperComponent } from './components/test-report-wrapper/test-report-wrapper.component';
import { TestSuiteDetailsComponent } from './components/test-suite-details/test-suite-details.component';
import { testSuiteDetailsMenuRoutes } from './components/test-suite-details/menu/routes';

export const appRoutes: Routes = [
  { path: 'summary', component: TestSummaryComponent },
  { path: 'testreport/:testReportId', component: TestReportWrapperComponent },
  {
    path: 'testreport/:testReportId/testsuite/:testSuiteId',
    component: TestSuiteDetailsComponent,
    children: testSuiteDetailsMenuRoutes
  },
  { path: '', redirectTo: '/summary', pathMatch: 'full' }
];
