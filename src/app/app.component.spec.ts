import { TestBed, async, tick, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'bitrise-app-header',
  template: ''
})
class MockAppHeaderComponent {}

@Component({
  selector: 'bitrise-app-footer',
  template: ''
})
class MockAppFooterComponent {}

@Component({
  selector: 'bitrise-mock-router-outlet-a-component',
  template: ''
})
class MockRouterOutletAComponent {}

@Component({
  selector: 'bitrise-mock-router-outlet-b-component',
  template: ''
})
class MockRouterOutletBComponent {}

describe('AppComponent', () => {
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        InlineSVGModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'mocked-route-a', component: MockRouterOutletAComponent },
          { path: 'mocked-route-b', component: MockRouterOutletBComponent }
        ]),
        HttpClientModule,
        environment.ServicesModule
      ],
      declarations: [
        AppComponent,
        MockAppHeaderComponent,
        MockAppFooterComponent,
        MockRouterOutletAComponent,
        MockRouterOutletBComponent
      ]
    }).compileComponents();

    router = TestBed.get(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
  });

  it('creates the app', () => {
    expect(app).not.toBeNull();
  });

  it('renders app header', () => {
    const appHeader = fixture.debugElement.query(By.css('bitrise-app-header'));
    expect(appHeader).not.toBeNull();
  });

  it('renders app footer', async(() => {
    const appFooter = fixture.debugElement.query(By.css('bitrise-app-footer'));
    expect(appFooter).not.toBeNull();
  }));

  it('renders component matching the current route', fakeAsync(() => {
    fixture.ngZone.run(() => router.navigate(['mocked-route-a']));

    tick();

    expect(fixture.debugElement.query(By.css('bitrise-mock-router-outlet-a-component'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('bitrise-mock-router-outlet-b-component'))).toBeNull();

    fixture.ngZone.run(() => router.navigate(['mocked-route-b']));

    tick();

    expect(fixture.debugElement.query(By.css('bitrise-mock-router-outlet-a-component'))).toBeNull();
    expect(fixture.debugElement.query(By.css('bitrise-mock-router-outlet-b-component'))).not.toBeNull();
  }));
});
