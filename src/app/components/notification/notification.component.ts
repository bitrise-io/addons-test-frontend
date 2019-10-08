import { Component, Input } from '@angular/core';

export enum NotificationType {
  warning = 'warning'
}

const typeCssClasses = {
  [NotificationType.warning]: 'warning'
};

const typeIconUrls = {
  [NotificationType.warning]: '/assets/images/sign-exclamationmark-triangle.svg'
};

@Component({
  selector: 'bitrise-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})

export class NotificationComponent {
  @Input() type: NotificationType;
  typeCssClass: string;
  typeIconUrl: string;

  ngOnInit() {
    this.typeCssClass = typeCssClasses[this.type];
    this.typeIconUrl = typeIconUrls[this.type];

    console.log(this.type);
  }
}
