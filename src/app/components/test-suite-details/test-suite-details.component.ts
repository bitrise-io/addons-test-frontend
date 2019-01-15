import { Component } from '@angular/core';

@Component({
  selector: 'bitrise-test-suite-details',
  templateUrl: './test-suite-details.component.html',
  styleUrls: ['./test-suite-details.component.scss']
})
export class TestSuiteDetailsComponent {
  testSuiteDetailsMenuItems = [{
    name: 'Test Cases',
    subpath: 'testcases'
  }, {
    name: 'Performance',
    subpath: 'performance'
  }, {
    name: 'Video',
    subpath: 'video'
  }, {
    name: 'Screenshots',
    subpath: 'screenshots'
  }, {
    name: 'Test Artifacts',
    subpath: 'testartifacts'
  }, {
    name: 'Logs',
    subpath: 'logs'
  }]
}
