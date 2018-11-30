import { TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-header',
  template: ''
})
export class MockAppHeaderComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, MockAppHeaderComponent]
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
