import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-header',
  template: ''
})
class MockAppHeaderComponent {}

@Component({
  template: ''
})
class MockedRouterOutletComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        InlineSVGModule.forRoot(),
        RouterTestingModule.withRoutes([{ path: 'mocked-route', component: MockedRouterOutletComponent }])
      ],
      declarations: [AppComponent, MockAppHeaderComponent, MockedRouterOutletComponent]
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
});
