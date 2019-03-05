import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'bitrise-heading-text',
  template: '<div class="heading-text"><ng-content></ng-content></div>',
  styleUrls: ['./heading-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingTextComponent {}
