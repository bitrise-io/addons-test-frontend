import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { TestSummaryComponent } from './test-cases/test-summary/test-summary.component';
import { TestSummaryHeaderComponent } from './test-cases/test-summary-header/test-summary-header.component';
import { MaximizePipe } from './maximize.pipe';
import { appRoutes } from './routes';
import { TestSuiteService } from './test-cases/test-suite/test-suite.service';
import { TestSuiteComponent } from './test-cases/test-suite/test-suite.component';
@NgModule({
  declarations: [
    AppComponent,
    AppHeaderComponent,
    AppFooterComponent,
    MaximizePipe,
    TestSummaryComponent,
    TestSummaryHeaderComponent,
    TestSuiteComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    InlineSVGModule.forRoot(),
  ],
  exports: [],
  providers: [
    TestSuiteService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
