import { TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from 'src/app/mock-store/testing';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { TestSuiteDetailsMenuLogsComponent } from './test-suite-details-menu-logs.component';
import { Log } from '../../../../models/log.model';
import logReducer from 'src/app/store/log/reducer';
import { LogLine } from 'src/app/models/log-line.model';
import { LogLineLevel } from 'src/app/models/log-line-level.model';

describe('TestSuiteDetailsMenuLogsComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsMenuLogsComponent>;
  let logsComponent: TestSuiteDetailsMenuLogsComponent;
  let store: MockStore<{
    log: {
      log: Log;
      downloadURL: string;
    };
  }>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        StoreModule.forRoot({ log: logReducer }),
        InlineSVGModule.forRoot()
      ],
      declarations: [TestSuiteDetailsMenuLogsComponent],
      providers: [provideMockStore({})]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuiteDetailsMenuLogsComponent);
    logsComponent = fixture.debugElement.componentInstance;
  });

  beforeEach(inject([Store], (mockStore: MockStore<{ log: { log: Log; downloadURL: string } }>) => {
    store = mockStore;
    store.setState({
      log: undefined
    });
  }));

  it('creates the log menu component', () => {
    expect(logsComponent).not.toBeNull();
  });

  describe('when there is short log', () => {
    beforeEach(() => {
      const log = new Log();
      log.lines = Array(3)
        .fill(null)
        .map(() => new LogLine());
      store.setState({
        log: {
          log: log,
          downloadURL: 'https://bitrise.io/download-log'
        }
      });

      fixture.detectChanges();
    });

    it('renders as many line elements as there are log lines', () => {
      expect(fixture.debugElement.queryAll(By.css('.line')).length).toBe(3);
    });

    it('has a button for downloading the log, with the appropriate link', () => {
      expect(
        fixture.debugElement.query(By.css('.download-log')).nativeElement.attributes.getNamedItem('href').value
      ).toBe('https://bitrise.io/download-log');
    });
  });

  describe('when there is long log', () => {
    beforeEach(() => {
      const log = new Log();
      log.lines = Array(22)
        .fill(null)
        .map(() => new LogLine());
      store.setState({
        log: {
          log: log,
          downloadURL: 'https://bitrise.io/download-log'
        }
      });

      fixture.detectChanges();
    });

    it('renders maximum number of log lines initially allowed', () => {
      expect(fixture.debugElement.queryAll(By.css('.line')).length).toBe(20);
    });
  });

  describe('when level filter is turned on', () => {
    let dropdownElement: DebugElement;

    beforeEach(() => {
      const log = new Log();
      log.lines = Array(7)
        .fill(null)
        .map(() => new LogLine());
      log.lines[0].level = LogLineLevel.warning;
      log.lines[1].level = LogLineLevel.warning;
      log.lines[2].level = LogLineLevel.warning;
      log.lines[3].level = LogLineLevel.info;
      log.lines[4].level = LogLineLevel.info;
      log.lines[5].level = LogLineLevel.error;
      log.lines[6].level = LogLineLevel.error;
      store.setState({
        log: {
          log: log,
          downloadURL: 'https://bitrise.io/download-log'
        }
      });

      fixture.detectChanges();

      dropdownElement = fixture.debugElement.query(By.css('.level-filter-select'));
      dropdownElement.nativeElement.value = dropdownElement.nativeElement.options[1].value;
      dropdownElement.nativeElement.dispatchEvent(new Event('change'));

      fixture.detectChanges();
    });

    it('only renders log lines with that level', () => {
      expect(fixture.debugElement.queryAll(By.css('.line')).length).toBe(2);
    });
  });
});
