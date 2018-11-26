import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<h1>Frontend of the {{ title }}</h1>',
  styles: [`
    h1 {
      color: #492f5c;
    }
  `]
})
export class AppComponent {
  title = 'Test add-on';
}
