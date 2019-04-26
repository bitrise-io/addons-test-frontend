import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Performance } from 'src/app/models/performance.model';
import { FetchPerformance } from 'src/app/store/performance/actions';

@Component({
  selector: 'bitrise-test-suite-details-menu-performance',
  templateUrl: './test-suite-details-menu-performance.component.html',
  styleUrls: ['./test-suite-details-menu-performance.component.scss']
})
export class TestSuiteDetailsMenuPerformanceComponent implements OnInit {
  metrics = [
    {
      id: 'cpu',
      name: 'CPU performance',
      cssClass: 'cpu',
      currentTimeInMilliseconds: undefined,
      sampleGroups: [{ id: 'cpu_samples', samples: undefined }]
    },
    {
      id: 'memory',
      name: 'Memory usage (KB)',
      cssClass: 'memory',
      currentTimeInMilliseconds: undefined,
      sampleGroups: [{ id: 'ram_samples', samples: undefined }]
    },
    {
      id: 'network',
      name: 'Network (KB/S)',
      cssClass: 'network',
      currentTimeInMilliseconds: undefined,
      sampleGroups: [
        { id: 'nwu_samples', name: 'upload', samples: undefined },
        { id: 'nwd_samples', name: 'download', samples: undefined }
      ]
    }
  ];
  durationInMilliseconds: number;
  timeGrid: number[];
  hasLoaded = false;

  performance$: Observable<Performance>;

  constructor(private datePipe: DatePipe, private store: Store<{ performance: Performance }>) {
    this.performance$ = store.select('performance');
  }

  ngOnInit() {
    this.store.dispatch(new FetchPerformance());

    this.performance$.subscribe((performance) => {
      this.hasLoaded = true;
      this.parsePerformanceData(performance);
    });
  }

  parsePerformanceData = function(performanceData: Performance) {
    this.metrics.forEach((metric) => {
      metric.sampleGroups.forEach((sampleGroup) => {
        sampleGroup.samples = Object.keys(performanceData[sampleGroup.id]).map((time) => {
          return {
            time: Number(time),
            value: performanceData[sampleGroup.id][time]
          };
        });

        this.durationInMilliseconds = Math.max(
          Number(Object.keys(performanceData[sampleGroup.id])[Object.keys(performanceData[sampleGroup.id]).length - 1]),
          this.durationInMilliseconds | 0
        );
      });
    });

    this.metrics.forEach((metric: any) => {
      metric.currentTimeInMilliseconds = this.durationInMilliseconds / 2;

      let valueGridTop: number;

      metric.sampleGroups.forEach((sampleGroup: { title?: string; samples: [] }) => {
        valueGridTop = Math.max(this.highestValueFromSamples(sampleGroup.samples), valueGridTop | 0);
      });

      if (valueGridTop === 0) {
        valueGridTop = 100;
      }

      metric.valueGrid = Array(5)
        .fill(null)
        .map((_element: any, index: number, array: any[]) => {
          return valueGridTop - (valueGridTop * index) / (array.length - 1);
        });

      metric.sampleCurves = metric.sampleGroups.map((sampleGroup: { title?: string; samples: [] }) => {
        return this.pathCurveFromSamples(sampleGroup.samples, valueGridTop);
      });
    });

    this.timeGrid = Array(4)
      .fill(null)
      .map((_element: any, index: number, array: any[]) => {
        return (this.durationInMilliseconds * index) / (array.length - 1);
      });
  };

  durationAsPercent = function(metric) {
    return (100 * metric.currentTimeInMilliseconds) / this.durationInMilliseconds;
  };

  sampleValueAtCurrentTime = function(
    metric,
    samples: {
      time: number;
      value: number;
    }[]
  ) {
    const indexOfSampleAfterCurrentTime = samples.findIndex(
      (sample: { time: number; value: number }) => sample.time >= metric.currentTimeInMilliseconds
    );

    const sampleAfterCurrentTime = samples[indexOfSampleAfterCurrentTime];
    if (sampleAfterCurrentTime.time === metric.currentTimeInMilliseconds) {
      return sampleAfterCurrentTime.value;
    } else {
      const sampleBeforeCurrentTime = samples[indexOfSampleAfterCurrentTime - 1];
      return (
        sampleBeforeCurrentTime.value +
        ((sampleAfterCurrentTime.value - sampleBeforeCurrentTime.value) *
          (metric.currentTimeInMilliseconds - sampleBeforeCurrentTime.time)) /
          (sampleAfterCurrentTime.time - sampleBeforeCurrentTime.time)
      );
    }
  };

  sampleValueAsPercentAtCurrentTime = function(
    metric,
    samples: {
      time: number;
      value: number;
    }[]
  ) {
    return (100 * this.sampleValueAtCurrentTime(metric, samples)) / metric.valueGrid[0];
  };

  printableSampleValuesAtCurrentTime = function(metric) {
    return metric.sampleGroups
      .map((sampleGroup) => {
        return this.printableValueForMetric(this.sampleValueAtCurrentTime(metric, sampleGroup.samples), metric);
      })
      .join(', ');
  };

  highestValueFromSamples = function(
    samples: {
      time: number;
      value: number;
    }[]
  ) {
    return samples.reduce(
      (
        highestValue: number,
        sample: {
          time: number;
          value: number;
        }
      ) => Math.max(sample.value, highestValue),
      0
    );
  };

  pathCurveFromSamples = function(
    samples: {
      time: number;
      value: number;
    }[], valueGridTop: number
  ) {
    let pathCurve = 'M-100 200';

    samples.forEach(
      (
        sample: {
          time: number;
          value: number;
        },
        index: number,
        array: {
          time: number;
          value: number;
        }[]
      ) => {
        const positionX = (100 * sample.time) / this.durationInMilliseconds;
        const positionY =
          100 -
          (100 * sample.value) /
            (valueGridTop > 0 ? valueGridTop : 1);

        if (index === 0) {
          pathCurve += ' L-100 ' + positionY;
        }

        pathCurve += ' L' + positionX + ' ' + positionY;

        if (index === array.length - 1) {
          pathCurve += ' L' + positionX + ' 100 L200 100 L200 200 Z';
        }
      }
    );

    return pathCurve;
  };

  printableValueForMetric = function(value, metric) {
    switch (metric.id) {
      case 'cpu':
        return Math.round(value) + '%';
      case 'memory':
      case 'network':
        if (value >= 1000) {
          return Math.round(value / 100) / 10 + 'k';
        }

        return Math.round(value);
    }
  };

  printableDuration(durationInMilliseconds) {
    if (durationInMilliseconds === null || durationInMilliseconds === undefined) {
      return durationInMilliseconds;
    }

    const date = new Date();

    date.setMinutes(Math.floor(durationInMilliseconds / 1000 / 60));
    date.setSeconds(Math.floor((durationInMilliseconds / 1000) % 60));

    return this.datePipe.transform(date, 'm:ss');
  }

  sampleCurveLinearGradientID = function(metric) {
    return 'metric-linear-gradient-' + metric.id;
  };

  sampleCurveFillURL = function(metric) {
    return window.location + '#' + this.sampleCurveLinearGradientID(metric);
  };

  metricSeekSelected = function(event, metric) {
    const fullScaleWidth = event.currentTarget.offsetWidth;

    let positionX = event.offsetX;
    if (event.target !== event.currentTarget) {
      positionX += event.target.getBoundingClientRect().left - event.currentTarget.getBoundingClientRect().left;
    }

    metric.currentTimeInMilliseconds = (this.durationInMilliseconds * positionX) / fullScaleWidth;
  };
}
