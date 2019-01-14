import { Routes } from '@angular/router';

import { TestSummaryComponent } from './components/test-summary/test-summary.component';
import { TestReportComponent } from './components/test-report/test-report.component';
import { TestSuiteDetailsComponent } from './components/test-suite-details/test-suite-details.component';

export const appRoutes: Routes = [
  { path: 'summary', component: TestSummaryComponent },
  { path: 'testreport/:testReportId', component: TestReportComponent },
  { path: 'testreport/:testReportId/testsuite/:testSuiteId', component: TestSuiteDetailsComponent },
  { path: '', redirectTo: '/summary', pathMatch: 'full' }
];
