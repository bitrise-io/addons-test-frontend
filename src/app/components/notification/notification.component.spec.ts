import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InlineSVGModule } from 'ng-inline-svg';
import { HttpClientModule } from '@angular/common/http';

import { NotificationComponent, NotificationType } from './notification.component';

describe('NotificationComponent', () => {
  let fixture: ComponentFixture<NotificationComponent>;
  let notificationComponent: NotificationComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InlineSVGModule.forRoot(), HttpClientModule],
      declarations: [NotificationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    notificationComponent = fixture.debugElement.componentInstance;
  });

  it('renders', () => {
    expect(notificationComponent).toBeTruthy();
  });

  [{ type: NotificationType.warning, expectedCssClass: 'warning' }].forEach(({ type, expectedCssClass }) => {
    describe(`when type is ${type}`, () => {
      beforeEach(() => {
        notificationComponent.type = type;
        fixture.detectChanges();
      });

      it(`sets CSS class to '${expectedCssClass}'`, () => {
        expect(notificationComponent.typeCssClass).toBe(expectedCssClass);
      });
    });
  });
});
