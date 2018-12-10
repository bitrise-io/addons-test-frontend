import { Routes } from '@angular/router';

import { TestSummaryComponent } from './test-cases/test-summary/test-summary.component';
import { TestSuiteComponent } from './test-cases/test-suite/test-suite.component';

export const appRoutes: Routes = [
  { path: 'summary', component: TestSummaryComponent },
  { path: 'testsuite/:testSuiteId', component: TestSuiteComponent },
  { path: '', redirectTo: '/summary', pathMatch: 'full' }
];
