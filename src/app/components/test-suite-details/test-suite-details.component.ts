import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bitrise-test-suite-details',
  templateUrl: './test-suite-details.component.html',
  styleUrls: ['./test-suite-details.component.scss']
})
export class TestSuiteDetailsComponent implements OnInit, OnDestroy {
  activatedRouteParamsSubscription: Subscription;

  testSuiteDetailsMenuItems = [
    {
      name: 'Test Cases',
      subpath: 'testcases'
    },
    {
      name: 'Performance',
      subpath: 'performance'
    },
    {
      name: 'Video',
      subpath: 'video'
    },
    {
      name: 'Screenshots',
      subpath: 'screenshots'
    },
    {
      name: 'Test Artifacts',
      subpath: 'testartifacts'
    },
    {
      name: 'Logs',
      subpath: 'logs'
    }
  ];
  selectedTestSuiteDetailsMenuItem: {
    name: string;
    subpath: string;
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.selectedTestSuiteDetailsMenuItem = this.testSuiteDetailsMenuItems.find(
      (testSuiteDetailsMenuItem: any) =>
        testSuiteDetailsMenuItem.subpath === this.activatedRoute.firstChild.snapshot.routeConfig.path
    );
  }

  ngOnDestroy() {}

  selectedTestSuiteDetailsMenuItemChanged() {
    this.router.navigate([`./${this.selectedTestSuiteDetailsMenuItem.subpath}`], { relativeTo: this.activatedRoute });
  }
}
