import { TestBed, async, tick, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-header',
  template: ''
})
class MockAppHeaderComponent {}

@Component({
  selector: 'app-footer',
  template: ''
})
class MockAppFooterComponent {}

@Component({
  selector: 'mocked-router-outlet-component-a',
  template: ''
})
class MockedRouterOutletComponentA {}

@Component({
  selector: 'mocked-router-outlet-component-b',
  template: ''
})
class MockedRouterOutletComponentB {}

describe('AppComponent', () => {
  let router: Router;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        InlineSVGModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'mocked-route-a', component: MockedRouterOutletComponentA },
          { path: 'mocked-route-b', component: MockedRouterOutletComponentB }
        ])
      ],
      declarations: [AppComponent, MockAppHeaderComponent, MockedRouterOutletComponentA, MockedRouterOutletComponentB]
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
    const appHeader = fixture.debugElement.query(By.css('app-header'));
    expect(appHeader).not.toBeNull();
  });

  it('renders app footer', async(() => {
    const appFooter = fixture.debugElement.query(By.css('app-footer'));
    expect(appFooter).not.toBeNull();
  }));

  it('renders component matching the current route', fakeAsync(() => {
    router.navigate(['mocked-route-a']);

    tick();

    expect(fixture.debugElement.query(By.css('mocked-router-outlet-component-a'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('mocked-router-outlet-component-b'))).toBeNull();

    router.navigate(['mocked-route-b']);

    tick();

    expect(fixture.debugElement.query(By.css('mocked-router-outlet-component-a'))).toBeNull();
    expect(fixture.debugElement.query(By.css('mocked-router-outlet-component-b'))).not.toBeNull();
  }));
});
