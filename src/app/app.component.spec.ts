import { TestBed, async, tick, fakeAsync, ComponentFixture, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { Store, StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { MockStore, provideMockStore } from './mock-store/testing';
import { AppStoreState, AppReducer } from './store/app/reducer';
import { Beam } from '@bitrise/beam';

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
  let store: MockStore<{ app: AppStoreState }>;
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({ app: AppReducer }),
        InlineSVGModule.forRoot(),
        RouterTestingModule.withRoutes([
          { path: 'mocked-route-a', component: MockRouterOutletAComponent },
          { path: 'mocked-route-b', component: MockRouterOutletBComponent }
        ]),
        HttpClientModule,
        environment.ServicesModule
      ],
      providers: [provideMockStore({})],
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

  beforeEach(inject([Store], (mockStore: MockStore<{ app: AppStoreState }>) => {
    store = mockStore;
    store.setState({
      app: {
        slug: undefined,
        name: undefined
      }
    });
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

  describe('when app info is fetched', () => {
    beforeEach(() => {
      store.setState({
        app: {
          slug: 'my-app-slug',
          name: 'My app'
        }
      });

      Beam['init'] = jasmine.createSpy('init').and.callFake(() => {});

      fixture.detectChanges();
    });

    it('sets Beam header with fetched info', () => {
      expect(Beam.init).toHaveBeenCalledWith({
        app_slug: 'my-app-slug',
        app_name: 'My app'
      });
    });
  });
});
