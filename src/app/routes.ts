import { Routes } from '@angular/router';

import { TestSummaryComponent } from './components/test-summary/test-summary.component';
import { TestReportWrapperComponent } from './components/test-report-wrapper/test-report-wrapper.component';
import { TestSuiteDetailsComponent } from './components/test-suite-details/test-suite-details.component';
import { testSuiteDetailsMenuRoutes } from './components/test-suite-details/menu/routes';
import { TestSuiteResolve } from './services/test-suite.resolve.service';

export const appRoutes: Routes = [
  { path: 'builds/:buildSlug/summary', component: TestSummaryComponent },
  { path: 'builds/:buildSlug/testreport/:testReportId', component: TestReportWrapperComponent },
  {
    path: 'builds/:buildSlug/testreport/:testReportId/testsuite/:testSuiteId',
    component: TestSuiteDetailsComponent,
    children: testSuiteDetailsMenuRoutes,
    resolve: {
      testSuite: TestSuiteResolve
    }
  },
  { path: 'builds/:buildSlug', redirectTo: '/builds/:buildSlug/summary?status=failed', pathMatch: 'full' }
];
