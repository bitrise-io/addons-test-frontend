import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';
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

  it('renders component matching the current route', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    router.navigate(['mocked-route-a']);

    tick();

    const mockedRouterOutletComponentA = fixture.debugElement.query(By.css('mocked-router-outlet-component-a'));
    expect(mockedRouterOutletComponentA).not.toBeNull();

    router.navigate(['mocked-route-b']);

    tick();

    const mockedRouterOutletComponentB = fixture.debugElement.query(By.css('mocked-router-outlet-component-b'));
    expect(mockedRouterOutletComponentB).not.toBeNull();
  }));
});
