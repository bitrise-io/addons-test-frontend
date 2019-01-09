import { Routes } from '@angular/router';

import { TestSummaryComponent } from './components/test-summary/test-summary.component';
import { TestReportComponent } from './components/test-report/test-report.component';

export const appRoutes: Routes = [
  { path: 'summary', component: TestSummaryComponent },
  { path: 'testreport/:testReportId', component: TestReportComponent },
  { path: '', redirectTo: '/summary', pathMatch: 'full' }
];
