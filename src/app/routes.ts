import { Routes } from '@angular/router';

import { TestSummaryComponent } from './components/test-summary/test-summary.component';
import { TestReportWrapperComponent } from './components/test-report-wrapper/test-report-wrapper.component';

export const appRoutes: Routes = [
  { path: 'summary', component: TestSummaryComponent },
  { path: 'testreport/:testReportId', component: TestReportWrapperComponent },
  { path: '', redirectTo: '/summary', pathMatch: 'full' }
];
