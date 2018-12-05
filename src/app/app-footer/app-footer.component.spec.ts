import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppFooterComponent } from './app-footer.component';
import { HttpClientModule } from '@angular/common/http';
import { InlineSVGModule } from 'ng-inline-svg';

describe('AppFooterComponent', () => {
  let appFooter: AppFooterComponent;
  let fixture: ComponentFixture<AppFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, InlineSVGModule.forRoot()],
      declarations: [AppFooterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFooterComponent);
    appFooter = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the footer', () => {
    expect(appFooter).toBeTruthy();
  });
});
