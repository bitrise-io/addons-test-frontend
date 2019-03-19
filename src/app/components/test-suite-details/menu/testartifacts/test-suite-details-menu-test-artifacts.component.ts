import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { TestArtifact } from 'src/app/models/test-artifact.model';
import { FetchArtifact } from 'src/app/store/artifacts/actions';

@Component({
  selector: 'bitrise-test-suite-details-menu-test-artifacts',
  templateUrl: './test-suite-details-menu-test-artifacts.component.html',
  styleUrls: ['./test-suite-details-menu-test-artifacts.component.scss']
})
export class TestSuiteDetailsMenuTestArtifactsComponent implements OnInit {
  downloadAllTestArtifactsURL: string;
  testArtifacts: TestArtifact[];
  testArtifacts$: Observable<any>;

  constructor(
    private store: Store<{
      testArtifact: {
        testArtifacts: TestArtifact[];
        downloadAllURL: string;
      };
    }>
  ) {
    this.testArtifacts$ = store.select('testArtifact');
  }

  ngOnInit() {
    this.store.dispatch(new FetchArtifact());

    this.testArtifacts$.subscribe((testArtifactsData: any) => {
      this.testArtifacts = testArtifactsData.testArtifacts;
      this.downloadAllTestArtifactsURL = testArtifactsData.downloadAllURL;
    });
  }
}
