import { Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line component-selector
  selector: 'virtual-scroller',
  template: '<ng-content></ng-content>'
})
export class MockVirtualScrollerComponent<T> {
  @Input('items') viewPortItems: Array<T>;
  @Input() parentScroll: string;
  @Input() bufferAmount: number;
  @Input() childHeight: number;
  @Input() resizeBypassRefreshThreshold: number;
  @Input() enableUnequalChildrenSizes: boolean;
}

@Component({
  selector: 'bitrise-heading-text',
  template: ''
})
export class MockHeadingTextComponent {
  @Input() borderBottom: boolean;
}
