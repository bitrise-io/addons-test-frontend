import { Component, OnInit } from '@angular/core';
import { TestSuiteService } from './test-suite.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {
  testSuites;

  constructor(private testSuiteService: TestSuiteService) {}

  ngOnInit() {
    this.testSuites = this.testSuiteService.getTestSuites();
  }
}
