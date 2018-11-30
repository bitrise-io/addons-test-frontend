import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { InlineSVGModule } from "ng-inline-svg";

import { AppComponent } from "./app.component";
import { AppHeaderComponent } from "./app-header.component";

@NgModule({
  declarations: [AppComponent, AppHeaderComponent],
  imports: [BrowserModule, HttpClientModule, InlineSVGModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
