import { Routes } from '@angular/router';

import { TestSummaryComponent } from './test-summary.component';
import { TestReportComponent } from './test-report.component';

export const appRoutes: Routes = [
  { path: 'summary', component: TestSummaryComponent },
  { path: 'testreport/:testReportId', component: TestReportComponent },
  { path: '', redirectTo: '/summary', pathMatch: 'full' }
];
