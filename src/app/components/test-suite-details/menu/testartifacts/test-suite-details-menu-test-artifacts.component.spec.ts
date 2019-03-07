import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, StoreModule } from '@ngrx/store';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestSuiteDetailsMenuTestArtifactsComponent } from './test-suite-details-menu-test-artifacts.component';
import { TestArtifact } from '../../../../models/test-artifact.model';
import { testArtifactStoreReducer } from '../../../test-report/test-report.store';
import { MockStore } from 'src/app/store.mock';

describe('TestSuiteDetailsMenuTestArtifactsComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsMenuTestArtifactsComponent>;
  let testArtifactsComponent: TestSuiteDetailsMenuTestArtifactsComponent;
  let store: MockStore<{
    testArtifact: {
      testArtifacts: TestArtifact[];
      downloadAllURL: string;
    };
  }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({ testArtifact: testArtifactStoreReducer }),
        InlineSVGModule.forRoot()
      ],
      declarations: [TestSuiteDetailsMenuTestArtifactsComponent],
      providers: [{ provide: Store, useClass: MockStore }]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuiteDetailsMenuTestArtifactsComponent);
    testArtifactsComponent = fixture.debugElement.componentInstance;
  });

  beforeEach(inject(
    [Store],
    (mockStore: MockStore<{ testArtifact: { testArtifacts: TestArtifact[]; downloadAllURL: string } }>) => {
      store = mockStore;
      store.setState({
        testArtifact: undefined
      });
    }
  ));

  it('creates the test artifacts menu component', () => {
    expect(testArtifactsComponent).not.toBeNull();
  });

  describe('when there are some test artifacts', () => {
    beforeEach(() => {
      store.setState({
        testArtifact: {
          testArtifacts: Array(3)
            .fill(null)
            .map(() => new TestArtifact()),
          downloadAllURL: 'https://bitrise.io/download-all'
        }
      });

      fixture.detectChanges();
    });

    it('renders as many test artifact items as there are test artifacts', () => {
      expect(fixture.debugElement.queryAll(By.css('.test-artifact')).length).toBe(3);
    });

    it('has a button for downloading all the test artifacts, with the appropriate link', () => {
      expect(
        fixture.debugElement.query(By.css('.download-all')).nativeElement.attributes.getNamedItem('href').value
      ).toBe('https://bitrise.io/download-all');
    });
  });
});
