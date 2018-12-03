import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { AppComponent } from './app.component';
import { AppHeaderComponent } from './app-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

@Component({
  selector: 'app-root',
  template: ''
})
class MockAppComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        InlineSVGModule.forRoot(),
      ],
      declarations: [AppComponent, AppHeaderComponent, AppFooterComponent]
    }).compileComponents();
  }));

  it('creates the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).not.toBeNull();
  }));

  it('renders app header', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const appHeader = fixture.debugElement.query(By.css('app-header'));
    expect(appHeader).not.toBeNull();
  }));

  it('renders app footer', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const appFooter = fixture.debugElement.query(By.css('app-footer'));
    expect(appFooter).not.toBeNull();
  }));
});
