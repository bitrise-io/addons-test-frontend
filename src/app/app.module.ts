import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header.component';
import { appRoutes } from './routes';
import { MaximizePipe } from './maximize.pipe';
import { TestSummaryComponent } from './test-summary.component';
import { TestSuiteComponent } from './test-suite.component';
import { TestSuiteService } from './test-suite.service';

@NgModule({
  declarations: [AppComponent, AppHeaderComponent, MaximizePipe, TestSummaryComponent, TestSuiteComponent],
  imports: [BrowserModule, RouterModule.forRoot(appRoutes), HttpClientModule, InlineSVGModule.forRoot()],
  providers: [TestSuiteService],
  bootstrap: [AppComponent]
})
export class AppModule {}
