import { Component, Input } from '@angular/core';

@Component({
  selector: 'virtual-scroller',
  template: '<ng-content></ng-content>'
})
export class MockVirtualScrollerComponent<T> {
  @Input('items') viewPortItems: Array<T>;
  @Input() parentScroll: string
  @Input() enableUnequalChildrenSizes: boolean
}

@Component({
  selector: 'bitrise-heading-text',
  template: ''
})
export class MockHeadingTextComponent { }
