import { Directive, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { TestSuiteDetailsMenuVideoComponent } from './test-suite-details-menu-video.component';
import { PlaybackTimePipe } from 'src/app/pipes/playback-time.pipe';
import { TestReport } from 'src/app/models/test-report.model';
import { TestSuite } from 'src/app/models/test-suite.model';

describe('TestSuiteDetailsMenuVideoComponent', () => {
  let fixture: ComponentFixture<TestSuiteDetailsMenuVideoComponent>;
  let testVideoComponent: TestSuiteDetailsMenuVideoComponent;
  let testReport: TestReport;
  let testSuite: TestSuite;

  beforeEach(() => {
    testReport = new TestReport();
    testSuite = new TestSuite();
    testReport.testSuites = [testSuite];
    testReport.id = 1;
    testSuite.id = 2;
    testSuite.videoUrl = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestSuiteDetailsMenuVideoComponent, PlaybackTimePipe],
      providers: [
        Directive({ selector: '[inlineSVG]', inputs: ['inlineSVG'] })(class {}),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              data: of({ testSuite: { selectedTestReport: testReport, selectedTestSuite: testSuite } })
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestSuiteDetailsMenuVideoComponent);
    testVideoComponent = fixture.debugElement.componentInstance;
  });

  it('creates the test video menu component', () => {
    expect(testVideoComponent).not.toBeNull();
  });

  describe('isPlaying', () => {
    describe('when set to true', () => {
      it('should call play on the video element, and update the player', () => {
        testVideoComponent.video = {
          play: jasmine.createSpy('play')
        } as any;
        const spy = spyOn(testVideoComponent, 'playerUpdate').and.callThrough();
        testVideoComponent.isPlaying = true;
        expect(testVideoComponent.video.play).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
      });
    });
    describe('when set to false', () => {
      it('should call pause on the video element', () => {
        testVideoComponent.video = {
          pause: jasmine.createSpy('pause')
        } as any;
        testVideoComponent.isPlaying = false;
        expect(testVideoComponent.video.pause).toHaveBeenCalled();
      });
    });
    describe('when its value is queried', () => {
      it('should return the value of the paused field on the video element', () => {
        testVideoComponent.video = {
          paused: true
        } as any;
        expect(testVideoComponent.isPlaying).toBe(false);
        testVideoComponent.video = {
          paused: false
        } as any;
        expect(testVideoComponent.isPlaying).toBe(true);
      });
    });
  });

  describe('playerUpdate', () => {
    it('should update playedDuration from video.currentTime', () => {
      testVideoComponent.video = {
        currentTime: 9593
      } as any;
      testVideoComponent.playerUpdate();
      expect(testVideoComponent.playedDuration).toBe(9593);
    });
    describe('if the video is playing', () => {
      it('should call requestAnimationFrame and update again', () => {
        let frame = null;
        const spy = spyOn(window, 'requestAnimationFrame').and.callFake((fn: any) => (frame = fn));
        testVideoComponent.video = {
          currentTime: 9593,
          paused: false
        } as any;
        testVideoComponent.playerUpdate();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(frame).not.toBe(null);
        frame();
        expect(spy).toHaveBeenCalledTimes(2);
      });
    });

    describe('player', () => {
      it('should set video from nativeElement', () => {
        const VIDEO = {
          readyState: 4
        } as any;
        testVideoComponent.player = {
          nativeElement: VIDEO
        };

        expect(testVideoComponent.video).toEqual(VIDEO);
      });

      it('should update the duration if the video is already loaded', () => {
        const VIDEO = {
          readyState: 4,
          duration: 3921
        } as any;
        testVideoComponent.player = {
          nativeElement: VIDEO
        };

        expect(testVideoComponent.duration).toBe(3921);
      });

      it('should add an event listener if the video is not loaded yet', () => {
        let handler: any = null;
        const VIDEO = {
          readState: 0,
          addEventListener: jasmine.createSpy('addEventListener').and.callFake((_ev, fn) => (handler = fn)),
          duration: 3821
        } as any;

        testVideoComponent.player = {
          nativeElement: VIDEO
        };

        expect(VIDEO.addEventListener).toHaveBeenCalledWith('canplaythrough', { asymmetricMatch: (x: any) => !!x });

        expect(handler).not.toBe(null);
        expect(typeof handler).toBe('function');
        expect(testVideoComponent.duration).toBe(undefined);
        handler();
        expect(testVideoComponent.duration).toBe(3821);
      });
    });
  });

  describe('updateSeek', () => {
    describe('if called with an event', () => {
      it('should calculate the point being hovered', () => {
        testVideoComponent.updateSeek({ offsetX: 15 } as any, { getBoundingClientRect: () => ({ width: 100 }) } as any);

        expect(testVideoComponent.hoveredPoint).toBe(0.15);
      });
    });
    describe('if called without an event', () => {
      it('should reset the point', () => {
        testVideoComponent.hoveredPoint = 0.15;
        testVideoComponent.updateSeek();
        expect(testVideoComponent.hoveredPoint).toBe(null);
      });
    });
  });

  describe('seekTo', () => {
    it('should set video currentTime based on mouse position, and call playerUpdate', () => {
      testVideoComponent.player = {
        nativeElement: {
          readyState: 4,
          duration: 3921,
          currentTime: 0
        } as any
      };
      const spy = spyOn(testVideoComponent, 'playerUpdate').and.callThrough();
      testVideoComponent.seekTo({ offsetX: 15 } as any, { getBoundingClientRect: () => ({ width: 100 }) } as any);
      expect(testVideoComponent.video.currentTime).toBe(3921 * 0.15);
      expect(spy).toHaveBeenCalled();
    });
  });
});
