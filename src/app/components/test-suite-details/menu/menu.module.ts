import { NgModule } from '@angular/core';
import { TestSuiteDetailsMenuTestCasesComponent } from './test-cases/test-suite-details-menu-test-cases.component';
import { TestSuiteDetailsMenuPerformanceComponent } from './performance/test-suite-details-menu-performance.component';
import { TestSuiteDetailsMenuVideoComponent } from './video/test-suite-details-menu-video.component';
import { TestSuiteDetailsMenuScreenshotsComponent } from './screenshots/test-suite-details-menu-screenshots.component';
import { TestSuiteDetailsMenuTestArtifactsComponent } from './testartifacts/test-suite-details-menu-test-artifacts.component';
import { TestSuiteDetailsMenuLogsComponent } from './logs/test-suite-details-menu-logs.component';

@NgModule({
  declarations: [
    TestSuiteDetailsMenuTestCasesComponent,
    TestSuiteDetailsMenuPerformanceComponent,
    TestSuiteDetailsMenuVideoComponent,
    TestSuiteDetailsMenuScreenshotsComponent,
    TestSuiteDetailsMenuTestArtifactsComponent,
    TestSuiteDetailsMenuLogsComponent
  ]
})
export class TestSuiteDetailsMenuModule {}
