import { Component, OnInit } from '@angular/core';
import { Beam } from '@bitrise/beam';

@Component({
  selector: 'bitrise-app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  ngOnInit() {
    Beam.init({
      app_slug: 'd08709ae5c5f6171',
      app_name: 'Fast building app'
    });
  }
}
