import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'bitrise-heading-text',
  template: '<div class="heading-text" [class.border-bottom]="borderBottom"><ng-content></ng-content></div>',
  styleUrls: ['./heading-text.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeadingTextComponent {
  @Input() borderBottom = true;
}
