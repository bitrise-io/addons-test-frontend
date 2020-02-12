import { Component, Input } from '@angular/core';

@Component({
  selector: 'bitrise-loader-circle',
  styleUrls: ['./loader-circle.component.scss'],
  template: `
    <div class="content" *ngIf="show">
      <div class="loader-circle small"></div>
      <div class="loader-line-mask"><div class="loader-line"></div></div>
      <ng-content></ng-content>
    </div>
  `
})
export class LoaderCircleComponent {
  @Input() show = false;
}
