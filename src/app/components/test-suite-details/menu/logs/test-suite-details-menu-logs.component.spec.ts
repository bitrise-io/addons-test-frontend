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

  beforeEach(inject(
    [Store],
    (mockStore: MockStore<{ log: { log: Log; downloadURL: string } }>) => {
      store = mockStore;
      store.setState({
        log: undefined
      });
    }
  ));

  it('creates the log menu component', () => {
    expect(logsComponent).not.toBeNull();
  });

  describe('when there is short log', () => {
    beforeEach(() => {
      store.setState({
        log: {
          log: new Log().deserialize(
`01-01 08:00:01.123: I/Remoter(0): Lorem ipsum dolor sit amet, consectetur adipiscing elit
01-01 08:00:02.123: I/Remoter(1): Praesent mollis risus ac orci cursus feugiat
01-01 08:00:03.123: I/Remoter(2): Pellentesque semper est est, elementum iaculis purus iaculis et`
          ),
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
      store.setState({
        log: {
          log: new Log().deserialize(
`01-01 08:00:01.123: I/Remoter(0): Lorem ipsum dolor sit amet, consectetur adipiscing elit
01-01 08:00:02.123: I/Remoter(1): Praesent mollis risus ac orci cursus feugiat
01-01 08:00:03.123: I/Remoter(2): Pellentesque semper est est, elementum iaculis purus iaculis et
01-01 08:00:04.123: I/Remoter(3): Sed eu luctus ex
01-01 08:00:05.123: I/Remoter(4): Phasellus elementum pellentesque tellus quis finibus
01-01 08:00:06.123: D/AndroidRuntime(5): Integer interdum condimentum nisi sed tempor
01-01 08:00:07.123: D/AndroidRuntime(6): Aliquam erat volutpat
01-01 08:00:08.123: D/AndroidRuntime(7): Integer dignissim massa ante, euismod aliquet metus sollicitudin sit amet
01-01 08:00:09.123: D/AndroidRuntime(8): Ut vitae scelerisque purus, tempus condimentum est
01-01 08:00:10.123: D/AndroidRuntime(9): Mauris in ligula dolor
01-01 08:00:11.123: D/AndroidRuntime(10): Duis nec odio non mauris ullamcorper hendrerit ut eget ligula
01-01 08:00:12.123: D/AndroidRuntime(11): Duis justo lectus, lobortis vitae ipsum sit amet, mattis posuere lacus
01-01 08:00:13.123: D/AndroidRuntime(12): Donec lobortis orci et ipsum ullamcorper, vitae ultrices turpis cursus
01-01 08:00:14.123: D/AndroidRuntime(13): Mauris ut euismod leo
01-01 08:00:15.123: D/AndroidRuntime(14): Maecenas pellentesque ligula mattis turpis rhoncus, vitae placerat sem consequat
01-01 08:00:16.123: D/AndroidRuntime(15): Pellentesque magna ligula, ultricies in venenatis vitae, sodales in leo
01-01 08:00:17.123: D/AndroidRuntime(16): Quisque sed iaculis lectus, maximus auctor magna
01-01 08:00:18.123: D/AndroidRuntime(17): Etiam consectetur metus erat, eu tempus purus mollis id
01-01 08:00:19.123: D/AndroidRuntime(18): Praesent euismod eleifend nibh, ut facilisis nunc maximus sed
01-01 08:00:20.123: D/AndroidRuntime(19): Fusce laoreet laoreet massa, vitae mattis odio commodo vitae
01-01 08:00:21.123: D/AndroidRuntime(20): Etiam vitae sollicitudin ante, vitae posuere velit
01-01 08:00:22.123: D/AndroidRuntime(21): Nulla consequat, nisl eget scelerisque porttitor, est ex condimentum urna, ac pharetra lectus erat a ante`
          ),
          downloadURL: 'https://bitrise.io/download-log'
        }
      });

      fixture.detectChanges();
    });

    it('renders maximum number of log lines initially allowed', () => {
      expect(fixture.debugElement.queryAll(By.css('.line')).length).toBe(20);
    });
  });

  describe('when type filter is turned on', () => {
    let dropdownElement: DebugElement;

    beforeEach(() => {
      store.setState({
        log: {
          log: new Log().deserialize(
`01-01 08:01:23.123: W/System(82): Curabitur mi mauris, hendrerit eu elementum nec, facilisis quis ex
01-01 08:01:24.123: W/System(83): Phasellus vitae nunc elit
01-01 08:01:25.123: W/System(84): Mauris non tortor vitae leo ornare mollis non vel magna
01-01 08:01:33.123: I/Remoter(92): Fusce facilisis hendrerit leo ut lobortis
01-01 08:01:34.123: I/Remoter(93): Sed placerat nisi eu aliquet imperdiet
01-01 08:01:38.123: E/memtrack(97): Nulla facilisi
01-01 08:01:39.123: E/memtrack(98): Proin a massa sed est semper consequat ut ac felis`
          ),
          downloadURL: 'https://bitrise.io/download-log'
        }
      });

      fixture.detectChanges();

      dropdownElement = fixture.debugElement.query(By.css('.type-filter-select'));
      dropdownElement.nativeElement.value = dropdownElement.nativeElement.options[1].value;
      dropdownElement.nativeElement.dispatchEvent(new Event('change'));

      fixture.detectChanges();
    });

    it('only renders log lines with that type', () => {
      expect(fixture.debugElement.queryAll(By.css('.line')).length).toBe(2);
    });
  });
});
